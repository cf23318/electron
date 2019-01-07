// const { URL } = require('url')
// const fs = require('fs-extra')
// const path = require('path')
// const EventEmitter = require('events')
// const axios = require('axios')

import { URL } from 'url'
import fs from 'fs-extra'
import path from 'path'
import EventEmitter from 'events'
import axios from 'axios'

class M3U8Parser extends EventEmitter {
  constructor (args) {
    super()

    this.info = args
    this.sourceToken = args.sourceToken

    this.text = ''
    this.segments = []
    this.basename = path.basename(this.info.url)
    this.retry = 0
    this.totalRetry = 0
    this.downloadTotal = 0

    this.getM3U8Text()
  }

  getM3U8Text () {
    const m3u8FilePath = path.join(this.info.filePath, this.info.fileName)

    // 判断m3u8文件是否存在
    if (fs.existsSync(m3u8FilePath)) {
      fs.readFile(m3u8FilePath, 'utf8')
        .then((data) => {
          this.text = data
          this.parseText(data)

          this.emit('ready', { isCreateM3u8: false })
        })
        .catch((error) => {
          this.emit('error', error)
        })
    } else {
      axios
        .get(this.info.url, {
          cancelToken: this.sourceToken.token
        })
        .then((res) => {
          this.text = res.data
          this.parseText(res.data)

          this.emit('ready', { isCreateM3u8: true })
        })
        .catch((error) => {
          if (axios.isCancel(error)) {
            console.log('cancel: m3u8')
          } else {
            this.retry += 1

            if (this.retry <= this.totalRetry) {
              console.log(`重试 : ${this.retry}`, this.info.url, error.message)
              setTimeout(() => {
                this.getM3U8Text()
              }, 5000)
            } else {
              this.emit('error', error)
            }
          }
        })
    }
  }

  parseText () {
    const EXTText = this.text.match(/#EXTINF([^]+?)(?=#EXT-X-ENDLIST)/)
    if (!EXTText || !EXTText.length) {
      throw Error(`Not found valid M3U8 text in url: ${this.info.url}, only found: ${this.text}`)
    }

    const EXTINFs = EXTText[0].trim()
    const EXTINFList = EXTINFs.split(/\s+/)

    this.downloadTotal = EXTINFList.length / 2

    if (this.downloadTotal < 1) this.emit('error', 'ts数量不足!')

    for (let i = 0; i < this.downloadTotal; i++) {
      const EXTTime = EXTINFList[2 * i]
      // 获取ts文件名
      // 在kantv中m3u8文件和ts文件都在同一个目录中，所以可以直接获取ts名
      const EXTPath = EXTINFList[2 * i + 1].match(/([^/]+$)/)[1]

      const tsPath = path.join(this.info.filePath, EXTPath)
      // 如果ts文件不存在，那么向待抓列表中传递
      if (!fs.existsSync(tsPath)) {
        this.segments.push(this.parseEXTItem(EXTTime, EXTPath, i))
      }
    }
  }

  parseEXTItem (EXTTime, EXTPath, EXTIndex) {
    const time = Number(EXTTime.substring('#EXTINF:'.length, EXTTime.length - 1))
    const name = EXTPath.match(/\/?.*?.ts/g)[0].split('/').find(slice => slice.endsWith('.ts'))

    return {
      origin: `${EXTTime}\n${EXTPath}`,
      url: this.getEXTItemURL(EXTPath),
      filename: name,
      index: EXTIndex,
      time
    }
  }

  getEXTItemURL (EXTPath) {
    const m3u8UrlInfo = new URL(this.info.url)

    if (EXTPath.startsWith('/')) {
      return `${m3u8UrlInfo.origin}${EXTPath}`
    } else if (EXTPath.startsWith('http')) {
      return EXTPath
    } else {
      return `${m3u8UrlInfo.href.replace(this.basename, EXTPath)}`
    }
  }
}

// module.exports = M3U8Parser
export default M3U8Parser
