import path from 'path'
import fs from 'fs-extra'
import rimraf from 'rimraf'
import EventEmitter from 'events'
import M3U8Parser from './M3U8Parser'
import axios, { CancelToken } from 'axios'
import writeFileAtomic from 'write-file-atomic'
import { deepMerge, filterUnwantedFiles } from './utils.js'
import { getDirSize } from './node-utils.js'
import { cloneDeep, pick } from 'lodash'

export default class operateM3u8 extends EventEmitter {
  constructor (args) {
    super()

    const check = ['filePath', 'assetsPublicPath', 'fileName', 'type', 'id', 'partId', 'url', 'name', 'part', 'partName', 'quality', 'filePath']

    // 去除无效字段
    args = pick(args, check)

    // 校验字段是否存在
    for (let i = 0; i < check.length; i++) {
      if (!args[check[i]]) {
        throw new Error(`operateM3u8: ${check[i]}字段不存在!`)
      }
    }

    console.log(args)

    this.args = args

    this.info = {
      // _id,
      // playUrl,
      speed: '0.00 MB/s',
      percentage: '0%',
      pause: false,
      done: false,

      downloadTotal: 0,
      downloadErrorTotal: 0,
      downloadIndex: 0,
      downloadNumber: 0
    }
    this.sourceToken = CancelToken.source()
    this.fileFlags = 'w'
    this.pool = []
    this.downloadInfo = {
      // '001': {
      //   'writeStream': null,
      // },
    }
    this.totalRetry = 0
    this.keyRetry = 0

    this.totalChunkLength = 0
    this.lasttotalChunkLength = 0
    this.startTime = null
    this.tsRequest = null

    this.init()
  }

  async init () {
    try {
      // 确保文件夹存在
      fs.ensureDirSync(this.args.filePath)

      await this.createInfo()
      await this.saveInfoFile()

      this.emit('init', { info: cloneDeep(this.info) })
    } catch (error) {
      console.error(error)
      this.emit('error', error)
    }
  }

  /**
   * 生成并补气info信息
   */
  createInfo () {
    return new Promise(async (resolve, reject) => {
      try {
        let oldInfo = {}
        try {
          oldInfo = JSON.parse(await fs.readFile(path.resolve(this.args.filePath, 'info.json'), 'utf-8'))
        } catch (error) {}

        // 默认参数，老的参数，最新参数
        deepMerge(this.info, oldInfo, this.args, {
          playUrl: path.join(this.args.filePath, this.args.fileName)
        })

        // 判断info.json里的_id是否是生成
        if (!this.info._id) {
          this.info._id = `${new Date().getTime()}${parseInt(Math.random() * 9000000000 + 1000000000)}`
        }

        resolve(this.info)
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * 保存信息文件
   */
  saveInfoFile (type) {
    return new Promise(async (resolve, reject) => {
      try {
        const filePath = path.resolve(this.info.filePath, 'info.json')

        if (type === 'done') {
          let size = await getDirSize(this.info.filePath)

          deepMerge(this.info, {
            size: `${this.getSize(size).toFixed(2)}MD`,
            done: true,
            percentage: '100%'
          })
        }

        writeFileAtomic(filePath, JSON.stringify(this.info), 'utf8', (err) => {
          if (err) return reject(err)

          resolve()
        })
      } catch (err) {
        reject(err)
      }
    })
  }

  /**
   * 开启下载
   */
  download () {
    // 视频已经下载成功
    if (this.info.done) {
      console.log('视频已下载!')

      return
    }

    this.emit('downloadStart', { info: cloneDeep(this.info) })

    this.M3U8Parser = new M3U8Parser({
      ...this.info,
      sourceToken: this.sourceToken
    })
      .on('ready', this.handleParserReady.bind(this))
      .on('error', (error) => {
        console.error(error)
        this.emit('error', error)
      })
  }

  /**
   * 解析m3u8成功
   */
  handleParserReady ({ isCreateM3u8 }) {
    console.log('------> Start Download <------')

    this.info.downloadTotal = this.M3U8Parser.downloadTotal

    this.createM3u8({ isCreateM3u8 })
      .then(this.initDownloadKey.bind(this))
      .then(this.initDownloadTs.bind(this))
      .catch((err) => {
        console.log('catch error', err)
        this.emit('error', err)
      })
  }

  /**
   * 创建m3u8文件
   */
  createM3u8 ({ isCreateM3u8 }) {
    return new Promise((resolve, reject) => {
      // m3u8已经存在，无需创建（说明是断掉重下，这时不需要创建m3u8文件
      if (!isCreateM3u8) return resolve()

      // 写入文件前修正m3u8内ts和key文件的路径
      const m3u8Data = this.M3U8Parser.text
        .replace(/([^\n\r]+\.ts)/g, `${this.info.assetsPublicPath}$1`)
        .replace(/([^"\\.\\/]+.key)/g, `${this.info.assetsPublicPath}$1`)

      // 写入m3u8文件
      const m3u8FileName = path.resolve(this.info.filePath, this.info.fileName)
      writeFileAtomic(m3u8FileName, m3u8Data, 'utf8', (err) => {
        if (err) {
          return reject(new Error('无法写入m3u8文件'))
        }

        return resolve()
      })
    })
  }

  /**
   * 获取加密文件
   */
  initDownloadKey () {
    return new Promise((resolve, reject) => {
      const match = this.M3U8Parser.text.match(/([^"\\.\\/]+.key)/)

      if (match) {
        const keyName = match[1]
        const keyFileName = path.join(this.info.filePath, keyName)
        const m3u8UrlInfo = new URL(this.info.url)
        const keyRemoteUrl = m3u8UrlInfo.href.replace(path.basename(this.info.url), keyName)

        if (fs.existsSync(keyFileName)) {
          resolve()
        } else {
          resolve(this.downloadKey({ keyFileName, keyRemoteUrl }))
        }
      } else {
        resolve()
      }
    })
  }

  /**
   * 下载key文件
   * @param {String} keyFileName 文件路径
   * @param {String} keyRemoteUrl 文件的服务器地址
   */
  downloadKey ({ keyFileName, keyRemoteUrl }) {
    return new Promise((resolve, reject) => {
      axios
        .get(keyRemoteUrl, {
          cancelToken: this.sourceToken.token
        })
        .then((res) => {
          writeFileAtomic(keyFileName, res.data, 'utf8', (err) => {
            if (err) {
              return reject(new Error('无法写入ts文件'))
            }

            resolve()
          })
        })
        .catch((err) => {
          if (axios.isCancel(err)) {
            console.log('cancel: key')
          } else {
            this.keyRetry += 1

            if (this.keyRetry <= this.totalRetry) {
              console.log(`重试 : ${this.keyRetry}`, keyFileName, err.message)

              setTimeout(() => {
                resolve(this.downloadKey({ keyFileName, keyRemoteUrl }))
              }, 5000)
            } else {
              reject(err)
            }
          }
        })
    })
  }

  initDownloadTs () {
    this.setSegmentsPool()
    this.requireNextSegment()
  }

  /**
   * 设置ts列表
   */
  setSegmentsPool () {
    for (let i = 0; i < this.M3U8Parser.segments.length; i++) {
      const segment = this.M3U8Parser.segments[i]
      this.downloadInfo[segment.filename] = {
        'retry': 0,
        'writeStream': null
      }
      this.pool.push(segment)
    }
  }

  /**
   * 请求下一个ts段，如果ts已下载完成，那么会发出done事件
   */
  requireNextSegment () {
    if (this.pool.length <= 0) {
      this.saveInfoFile('done')
        .then(() => {
          this.emit('downloadDone', { info: cloneDeep(this.info) })

          console.log('------> Finish Download <------')
        })
        .catch((error) => {
          console.log(error)
        })
    } else {
      console.log('then')
      this.saveInfoFile('next')
      this.tsRequest = this.downloadSegment(this.pool.shift())
    }
  }

  /**
   * 下载ts文件
   * @param {*} segment 参考M3U8Parser文件中的parseEXTItem
   */
  downloadSegment (segment) {
    deepMerge(this.info, {
      downloadIndex: segment.index,
      downloadNumber: this.info.downloadTotal - this.pool.length
    })

    const segmentInfoText = `Segment-${this.info.downloadIndex} (${this.info.downloadNumber}/${this.info.downloadTotal})`

    this.emit('downloadProgress', {
      info: cloneDeep(this.info),
      message: `${segmentInfoText}: Pending...`
    })

    if (this.startTime) this.startTime = (new Date()).getTime()

    return axios
      .get(segment.url, {
        responseType: 'stream',
        cancelToken: this.sourceToken.token
      })
      .then((res) => {
        const segmentLen = this.getSize(parseInt(res.headers['content-length'], 10)).toFixed(4)
        const oldFileName = path.resolve(this.info.filePath, `${segment.filename}-temporary`)
        const newFileName = path.resolve(this.info.filePath, segment.filename)

        let chunkLength = 0

        if (this.downloadInfo[segment.filename].writeStream === null) {
          fs.ensureFileSync(oldFileName)

          this.downloadInfo[segment.filename].writeStream = fs.createWriteStream(oldFileName, {
            flags: this.fileFlags,
            autoclose: false
          })
        }

        res.data.on('data', (chunk) => {
          this.downloadInfo[segment.filename].writeStream.write(chunk)
          let parseIntChunkLength = parseInt(chunk.length)
          this.totalChunkLength += parseIntChunkLength
          const currentLoadTotalLength = this.getSize(this.totalChunkLength).toFixed(4)
          chunkLength += parseIntChunkLength
          const currentLoadLength = this.getSize(chunkLength).toFixed(4)

          let endTime = (new Date()).getTime()
          if (endTime - this.startTime > 1000) {
            this.info.speed = `${((currentLoadTotalLength - this.lasttotalChunkLength) / ((endTime - this.startTime) / 1000)).toFixed(2)} MB/s`
            this.lasttotalChunkLength = currentLoadTotalLength
            this.startTime = endTime
          }

          deepMerge(this.info, {
            percentage: `${((((this.info.downloadTotal - this.pool.length - 1) / this.info.downloadTotal) + (currentLoadLength / segmentLen / this.info.downloadTotal)) * 100).toFixed(2)}%`
          })

          this.emit('downloadProgress', {
            info: cloneDeep(this.info),
            message: `${segmentInfoText}: (${this.info.percentage})% ${currentLoadLength} / ${segmentLen} MB. `
          })
        })

        res.data.on('end', () => {
          this.downloadInfo[segment.filename].writeStream.close()
          // 请求被取消，不需要处理ts文件
          if (this.info.pause) return
          fs.renameSync(oldFileName, newFileName)
          this.emit('downloadProgress', {
            info: cloneDeep(this.info),
            message: `${segmentInfoText}: Size - ${segmentLen} MB. Success!`
          })
          this.requireNextSegment()
        })
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log('cancel: ts')
        } else {
          const retry = this.downloadInfo[segment.filename].retry += 1

          if (retry <= this.totalRetry) {
            console.log(`重试 : ${retry}`, JSON.stringify(segment), error.message)
            this.pool.push(segment)
            setTimeout(() => {
              this.requireNextSegment()
            }, 3000)
          } else {
            this.emit('error', error)
            this.info.downloadErrorTotal += 1
            this.requireNextSegment()
          }
        }
      })
  }

  /**
   * 转换为固定格式
   * @param {Number} length 字符长度
   * @param {String} unit 格式
   */
  getSize (length, unit = 'MB') {
    const UNIT_MAP = {
      'KB': 1024,
      'MB': 1024 * 1024,
      'GB': 1024 * 1024 * 1024
    }
    return length / UNIT_MAP[unit.toUpperCase()]
  }

  /**
   * 暂停
   */
  pause ({ isEmit } = { isEmit: true }) {
    try {
      this.info.pause = true
      this.info.speed = '0.00 MB/s'
      this.sourceToken.cancel('pause')
      if (isEmit) this.emit('downloadPause', { info: cloneDeep(this.info) })
    } catch (error) {
      console.error(error)
      this.emit('error', error)
    }
  }

  /**
   * 删除这一集
   */
  async delete () {
    try {
      try {
        await this.rimraf(this.info.filePath)
      } catch (error) {
        if (error.code !== 'ENOENT') {
          this.emit('error', {
            message: '移除文件失败'
          })
        }
      }

      const upperDir = path.join(this.info.filePath, '../')
      let remaining = await fs.readdir(upperDir)
      if (!filterUnwantedFiles(remaining).length) {
        await this.deleteAll({ isEmit: false })
      }

      this.emit('deleteDone')
    } catch (error) {
      console.log(error)
      if (error.code !== 'ENOENT') {
        this.emit('error', {
          message: '移除文件失败'
        })
      }
    }
  }

  /**
   * 删除这一部剧
   */
  async deleteAll ({ isEmit } = { isEmit: true }) {
    try {
      await this.rimraf(path.join(this.info.filePath, '../'))
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error(error)
        this.emit('error', {
          message: '移除文件失败'
        })
      }
    }

    if (isEmit) this.emit('deleteDone')
  }

  /**
   * 封装删除
   * @param {String} path 本地路径
   */
  rimraf (path) {
    if (!path) throw new Error('path不存在')

    return new Promise((resolve, reject) => {
      rimraf(path, (err) => {
        if (err) return reject(err)

        resolve()
      })
    })
  }
}
