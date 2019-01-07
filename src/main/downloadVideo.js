import path from 'path'
import fs from 'fs-extra'
import { app, ipcMain } from 'electron'
import { isArray, cloneDeep } from 'lodash'
import OperateM3u8 from './utils/OperateM3u8'
import { fixNewFilePath, deepMerge, filterUnwantedFiles } from './utils/utils'
import {
  DOWNLOAD_VIDEO,
  GET_ALL_LOCAL_VIDEO_INFO,
  GET_DOWNLOADING_VIDEO_INFO,
  CANCEL_DOWNLOAD_VIDEO,
  START_MESSAGE_TRANSFER,
  STOP_MESSAGE_TRANSFER,
  DELETE_SINGLE_EPISODE,
  DELETE_ALL_VIDEO,
  DOWNLOAD_UNFINISHED_VIDEO,
  PAUSE_ALL_VIDEO_DOWNLOAD
} from './ipcTypes'

// windows10 读取本地文件时路径会携带上 play.m3u8/001.ts ,所以这里采用 ../ 的方式
const assetsPublicPath = fixNewFilePath()

let eventInfo = null
// 保存 operateM3u8 的实例对象
const downloadInfoList = {}
let videoInfoList = []
// 当(videoInfoList)对象处于下载状态时，这里保存了他的内存地址，以便快速寻找
const episodeInfoChangeList = {}

// 从内存中读取所有视频信息
function getAllVideoInfoList () {
  const fileDir = path.join(app.getPath('videos'), `/kantv-video`)

  let videoFileRootList = fs.readdirSync(fileDir, 'utf-8')
  let videoFileInfoList = []

  if (isArray(videoFileRootList)) {
    // 过滤隐藏文件（.DS_Store)
    videoFileRootList = filterUnwantedFiles(videoFileRootList)

    // 递归获取内容
    videoFileInfoList = videoFileRootList.map(async (videoFileName) => {
      // 获取剧集列表
      let videoEpisodeList = fs.readdirSync(path.join(fileDir, videoFileName), 'utf-8')
      let videoEpisodeInfoList = []

      if (isArray(videoEpisodeList)) {
        // 过滤隐藏文件（.DS_Store)
        videoEpisodeList = filterUnwantedFiles(videoEpisodeList)

        for (let i = 0; i < videoEpisodeList.length; i++) {
          let currentVideoEpisodeName = videoEpisodeList[i]
          let currentVideoEpisodePath = path.join(fileDir, videoFileName, currentVideoEpisodeName, 'info.json')

          try {
            let info = await fs.readFile(currentVideoEpisodePath, 'utf-8')

            videoEpisodeInfoList.push(JSON.parse(info))
          } catch (err) {
            console.error(err)
            // 无法读取文件？ 按理来讲不存在的
          }
        }
      } else {
        return undefined
      }

      return videoEpisodeInfoList
    })
  } else {
    console.error(videoFileRootList)
  }

  return Promise.all(videoFileInfoList)
    .then((data) => {
      videoInfoList = data
        .filter((currentVideoInfo) => currentVideoInfo.length)
        .map((currentVideoInfo) => {
          return currentVideoInfo.map((currentEpisodeInfo) => {
            // 如果当前视频在下载队列中时，需要和最新数据进行合并
            if (episodeInfoChangeList[currentEpisodeInfo._id]) {
              episodeInfoChangeList[currentEpisodeInfo._id] = deepMerge(currentEpisodeInfo, episodeInfoChangeList[currentEpisodeInfo._id])
            }

            return currentEpisodeInfo
          })
        })

      return data
    })
}

// 通过生成的唯一id查找视频信息，如果查找不到，那么生成信息
function findEpisodeInfo ({ info }) {
  for (let i = 0; i < videoInfoList.length; i++) {
    if (videoInfoList[i][0].id === info.id) {
      for (let j = 0; j < videoInfoList[i].length; j++) {
        if (
          videoInfoList[i][j].partId === info.partId &&
          videoInfoList[i][j].quality === info.quality
        ) {
          return videoInfoList[i][j]
        }
      }

      videoInfoList[i].push(info)
      return info
    }
  }

  videoInfoList.unshift([info])
  return info
}

function addToDownloadInfoList ({ info, operateM3u8 }) {
  downloadInfoList[info._id] = operateM3u8
}

function deleteToDownloadInfoList ({ _id }) {
  delete downloadInfoList[_id]
}

function addToEpisodeInfoChangeList ({ info, operateM3u8 }) {
  let currentEpisodeInfo = findEpisodeInfo({ info })

  episodeInfoChangeList[info._id] = currentEpisodeInfo

  addToDownloadInfoList({ info, operateM3u8 })

  return currentEpisodeInfo
}

function deleteToEpisodeInfoChangeList ({ _id }) {
  delete episodeInfoChangeList[_id]
  deleteToDownloadInfoList({ _id })
}

/**
 * 视频不重复下载
 */
function doNotRepeatDownload ({ info, operateM3u8 }) {
  // 视频正在下载队列中
  if (downloadInfoList[info._id]) {
    console.log('禁止下载')
    operateM3u8.pause({ isEmit: false })
    return true
  }

  return false
}

/**
 * 下载视频
 */
ipcMain.on(DOWNLOAD_VIDEO, (event, episodeInfo) => {
  let { type } = episodeInfo

  // {
  //   type: 'm3u8',
  //   id: '000000000001',
  //   partId: '000000000002',
  //   url: 'http://xxxxxx',
  //   name: '风味人间',
  //   part: '1',
  //   partName: '第一集：香料歧路',
  //   quality: '270p'
  // }

  switch (type) {
    case 'm3u8':
      downloadM3U8(episodeInfo)
      break
  }
})

function downloadM3U8 (episodeInfo) {
  let { name, partName, quality } = episodeInfo
  name = name.replace(' ', ':')
  partName = partName.replace(' ', ':')
  quality = quality.replace(' ', ':')

  const filePath = path.join(app.getPath('videos'), `/kantv-video/${name}/${name} ${partName} ${quality}/`)

  let options = deepMerge(
    {
      filePath,
      assetsPublicPath: assetsPublicPath,
      fileName: `play.m3u8`
    },
    episodeInfo
  )

  let downloadStatus = {
    start: false,
    downloading: false,
    done: false,
    error: false
  }

  function cleanObject ({ _id }) {
    deleteToEpisodeInfoChangeList({ _id })
  }

  // 使用operateM3u8时请务必小心，不要影响内部属性
  let operateM3u8 = new OperateM3u8(options)
    .on('init', () => {
      operateM3u8.download()
    })
    .on('downloadStart', ({ info }) => {
      console.log('downloadM3U8: start')
      try {
        // 判断是否可以下载
        if (doNotRepeatDownload({ info, operateM3u8 })) return

        // start 之后可以得到完整的 info
        deepMerge(addToEpisodeInfoChangeList({ info, operateM3u8 }), downloadStatus, {
          start: true,
          downloading: true
        })
        if (eventInfo) eventInfo.sender.send(GET_ALL_LOCAL_VIDEO_INFO, cloneDeep(videoInfoList))
        if (eventInfo) eventInfo.sender.send(GET_DOWNLOADING_VIDEO_INFO, cloneDeep(episodeInfoChangeList))
      } catch (error) { console.error(error) }
    })
    .on('downloadProgress', ({ info }) => {
      deepMerge(episodeInfoChangeList[operateM3u8.info._id], info)
    })
    .on('downloadPause', ({ info }) => {
      console.log('downloadM3U8: pause')
      deepMerge(episodeInfoChangeList[operateM3u8.info._id], info, {
        downloading: false
      })
      try {
        if (eventInfo) eventInfo.sender.send(GET_DOWNLOADING_VIDEO_INFO, cloneDeep(episodeInfoChangeList))
      } catch (error) { console.error(error) }
      cleanObject({ _id: operateM3u8.info._id })
    })
    .on('downloadDone', ({ info }) => {
      console.log('downloadM3U8: done')
      deepMerge(episodeInfoChangeList[operateM3u8.info._id], info, {
        downloading: false,
        done: true
      })
      try {
        if (eventInfo) eventInfo.sender.send(GET_DOWNLOADING_VIDEO_INFO, cloneDeep(episodeInfoChangeList))
      } catch (error) { console.error(error) }
      cleanObject({ _id: operateM3u8.info._id })
    })
    .on('error', (error) => {
      console.log('downloadM3U8: error', error.message)
      deepMerge(episodeInfoChangeList[operateM3u8.info._id], {
        downloading: false,
        error: true
      })
      try {
        if (eventInfo) eventInfo.sender.send(GET_DOWNLOADING_VIDEO_INFO, cloneDeep(episodeInfoChangeList))
      } catch (error) { console.error(error) }
      cleanObject({ _id: operateM3u8.info._id })
    })
}

/**
 * 获取所有视频信息
 */
ipcMain.on(GET_ALL_LOCAL_VIDEO_INFO, (event) => {
  if (videoInfoList.length) {
    return event.sender.send(GET_ALL_LOCAL_VIDEO_INFO, cloneDeep(videoInfoList))
  }

  getAllVideoInfoList()
    .then(() => {
      event.sender.send(GET_ALL_LOCAL_VIDEO_INFO, cloneDeep(videoInfoList))
    })
})

/**
 * 获取当前正在下载中的视频列表
 */
ipcMain.on(GET_DOWNLOADING_VIDEO_INFO, (event) => {
  event.sender.send(GET_DOWNLOADING_VIDEO_INFO, cloneDeep(episodeInfoChangeList))
})

/**
 * 取消下载视频
 */
ipcMain.on(CANCEL_DOWNLOAD_VIDEO, (event, { _id }) => {
  cancelDownloadVideo({ _id })

  event.returnValue = true
})
function cancelDownloadVideo ({ _id }) {
  console.log('on cancel', _id)

  if (downloadInfoList[_id]) {
    downloadInfoList[_id].pause()
  } else {
    console.log('视频不在下载队列!')
  }
}

/**
 * 开启downloading数据传递
 */
ipcMain.on(START_MESSAGE_TRANSFER, (event) => {
  eventInfo = event

  event.returnValue = true
})

/**
 * 停止downloading数据传递
 */
ipcMain.on(STOP_MESSAGE_TRANSFER, (event) => {
  eventInfo = null

  event.returnValue = true
})

/**
 * 删除单个视频
 */
ipcMain.on(DELETE_SINGLE_EPISODE, (event, episodeInfo) => {
  cancelDownloadVideo(episodeInfo)

  let operateM3u8 = new OperateM3u8(episodeInfo)
    .on('init', () => {
      operateM3u8.delete()
    })
    .on('deleteDone', () => {
      getAllVideoInfoList()
        .then(() => {
          event.sender.send(DELETE_SINGLE_EPISODE, { videoInfoList: cloneDeep(videoInfoList) })
        })
    })
    .on('error', (error) => {
      console.log(error)
      event.sender.send(DELETE_SINGLE_EPISODE, { error: error })
    })
})

/**
 * 删除所有视频
 */
ipcMain.on(DELETE_ALL_VIDEO, (event, episodeInfoList) => {
  for (let i = 0; i < episodeInfoList.length; i++) {
    cancelDownloadVideo(episodeInfoList[i])
  }

  let operateM3u8 = new OperateM3u8(episodeInfoList[0])
    .on('init', () => {
      operateM3u8.deleteAll()
    })
    .on('deleteDone', () => {
      getAllVideoInfoList()
        .then(() => {
          event.sender.send(DELETE_ALL_VIDEO, { videoInfoList: cloneDeep(videoInfoList) })
        })
    })
    .on('error', (error) => {
      console.log(error)
      event.sender.send(DELETE_ALL_VIDEO, { error: error })
    })
})

/**
 * 下载所有暂停中的视频
 */
ipcMain.on(DOWNLOAD_UNFINISHED_VIDEO, (event) => {
  videoInfoList.forEach((currentVideoInfo) => {
    currentVideoInfo.forEach((currentEpisodeInfo) => {
      if (!currentEpisodeInfo.done) {
        downloadM3U8(currentEpisodeInfo)
      }
    })
  })
})

/**
 * 暂停所有视频下载
 */
ipcMain.on(PAUSE_ALL_VIDEO_DOWNLOAD, (event) => {
  for (let _id in downloadInfoList) {
    downloadInfoList[_id].pause()
  }
})
