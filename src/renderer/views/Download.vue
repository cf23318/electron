<template>
  <div class="download">
    <div class="download__title" v-show="formattingVideoInfoList.length">
      <div class="left-function-button-list">
        <div @click="pauseAllVideoDownload" :class="{disabled: disablePauseAll}"><i class="iconfont icon-pause"></i>全部暂停</div>
        <div @click="downloadUnfinishedVideo" :class="{disabled: disableDownloadAll}"><i class="iconfont icon-download"></i>全部下载</div>
      </div>

      <!-- <div class="tab">
        <div>全部</div>
        <div>正在下载</div>
        <div>已下载</div>
      </div> -->

      <!-- <div class="right-function-button-list">
        <div><i class="iconfont icon-delete"></i>全选</div>
        <div><i class="iconfont icon-delete"></i>删除</div>
        <div @click="downloadMoreVideo">编辑 ? 取消</div>
      </div> -->
    </div>

    <div class="download__contanier">
      <ul class="list" v-show="formattingVideoInfoList.length">
        <li class="list__item" v-for="formattingStructure in formattingVideoInfoList" :key="formattingStructure.id">
          <div class="video-info">
            <div class="video-info__info-warpper">
              <img class="video-info__info-pic" :src="formattingStructure.photo" alt="">

              <div class="video-info__info-detail">
                <div c.0ass="video-info__info-title" v-text="formattingStructure.name"></div>
                <div class="video-info__info-info">已缓存{{formattingStructure.length}}集(观看至第n集){{formattingStructure.size}}</div>
              </div>
            </div>

            <div class="video-info__function-button-list">
              <div class="video-info__more" @click="downloadMoreVideo">
                <i class="icon-font icon-add"></i>
                缓存更多集数
              </div>
              <div class="video-info__delete" @click="deleteMoreVideo(formattingStructure.episodeInfoList)"><i class="iconfont icon-delete"></i>删除</div>
            </div>
          </div>

          <ul class="video-list">
            <li class="video-list__item" v-for="episodeInfo in formattingStructure.episodeInfoList" :key="episodeInfo.partId + episodeInfo.quality" :class="{complete: episodeInfo.done}">
              <div class="video-list__item-title" v-text="`${episodeInfo.name} ${episodeInfo.partName} ${episodeInfo.quality}`"></div>

              <div class="video-list__item-progress" v-show="!episodeInfo.done">
                <div v-if="episodeInfo.error" class="video-list__item-progress__error">下载出现错误，请尝试重新下载!</div>
                <div v-else-if="episodeInfo.downloading" v-text="episodeInfo.speed"></div>
                <div v-else>已暂停</div>

                <div class="video-list__item-progress__progress-bar">
                  <div class="video-list__item-progress__progress-bar__mobi" :style="{width: episodeInfo.percentage}"></div>
                </div>
              </div>

              <div class="video-list__item-right">
                <div class="video-list__item-size" v-show="episodeInfo.size" v-text="episodeInfo.size"></div>

                <div class="video-list__item-function-button-list">
                  <div v-if="episodeInfo.done" @click="playVideo({ id: episodeInfo.id, partId: episodeInfo.partId })"><i class="iconfont icon-play"></i>播放</div>
                  <div v-if="!episodeInfo.done && episodeInfo.downloading" @click="pauseDownloadVideo(episodeInfo)"><i class="iconfont icon-pause"></i>暂停</div>
                  <div v-if="!episodeInfo.done && !episodeInfo.downloading" @click="downloadVideo(episodeInfo)"><i class="iconfont icon-download"></i>下载</div>
                  <div @click="removeVideo(episodeInfo)"><i class="iconfont icon-delete"></i>删除</div>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>

      <div class="empty" v-show="!formattingVideoInfoList.length">
        <img class="empty-pic" src="~assets/images/download-empty.png" alt="" width="258" height="146">
        <div class="empty-title">暂时无离线下载</div>
        <div class="empty-prompt">你可以在播放器右上角点击离线下载</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    GET_ALL_LOCAL_VIDEO_INFO,
    GET_DOWNLOADING_VIDEO_INFO,
    PLAYER__OPEN_PLAYER,
    CANCEL_DOWNLOAD_VIDEO,
    DOWNLOAD_VIDEO,
    START_MESSAGE_TRANSFER,
    STOP_MESSAGE_TRANSFER,
    DELETE_SINGLE_EPISODE,
    DELETE_ALL_VIDEO,
    DOWNLOAD_UNFINISHED_VIDEO,
    PAUSE_ALL_VIDEO_DOWNLOAD
  } from 'ipc-types'

  import { deepMerge } from 'utils/utils'

  export default {
    name: 'download',

    data () {
      return {
        getInfoTimer: null,
        videoInfoList: [],
        episodeInfoChangeList: {},
        disableDownloadAll: true
      }
    },

    computed: {
      formattingVideoInfoList () {
        this.disableDownloadAll = true

        return this.videoInfoList.map((episodeInfoList) => {
          let size = 0

          episodeInfoList = episodeInfoList
            .map((currentEpisodeInfo) => {
              console.log(!currentEpisodeInfo.done, !currentEpisodeInfo.downloading)
              if (!currentEpisodeInfo.done && !currentEpisodeInfo.downloading) this.disableDownloadAll = false

              let currentSize = parseFloat(currentEpisodeInfo.size)

              if (!isNaN(currentSize)) {
                size += currentSize
              }

              return currentEpisodeInfo
            })
            .sort((currentEpisodeInfo, nextEpisodeInfo) => {
              return currentEpisodeInfo.part - nextEpisodeInfo.part
            })

          size = size.toFixed(2)

          return {
            id: episodeInfoList[0].id,
            photo: episodeInfoList[0].photo,
            name: episodeInfoList[0].name,
            length: episodeInfoList.length,
            size: this.$lodash.isNaN(size) ? '' : `/文件大小${size}MB`,
            episodeInfoList
          }
        })
      },
      disablePauseAll () {
        return !Object.keys(this.episodeInfoChangeList).length
      }
    },

    mounted () {
      this.$electron.ipcRenderer.send(START_MESSAGE_TRANSFER)
  
      // 获取所有信息
      this.$electron.ipcRenderer.send(GET_ALL_LOCAL_VIDEO_INFO)
      this.$electron.ipcRenderer.on(GET_ALL_LOCAL_VIDEO_INFO, this.handlerAllLocalVideoInfo)
  
      // 获取当前下载中的视频信息
      this.getInfoTimer = setInterval(() => {
        this.$electron.ipcRenderer.send(GET_DOWNLOADING_VIDEO_INFO)
      }, 500)
  
      this.$electron.ipcRenderer.on(GET_DOWNLOADING_VIDEO_INFO, this.handlerDownloadingVideoInfo)

      // 视频删除信息
      this.$electron.ipcRenderer.on(DELETE_SINGLE_EPISODE, this.handlerDelete)
      this.$electron.ipcRenderer.on(DELETE_ALL_VIDEO, this.handlerDelete)
    },

    beforeDestroy () {
      this.$electron.ipcRenderer.send(STOP_MESSAGE_TRANSFER)

      clearInterval(this.getInfoTimer)
      this.$electron.ipcRenderer.removeListener(GET_ALL_LOCAL_VIDEO_INFO, this.handlerAllLocalVideoInfo)
      this.$electron.ipcRenderer.removeListener(GET_DOWNLOADING_VIDEO_INFO, this.handlerDownloadingVideoInfo)
      this.$electron.ipcRenderer.removeListener(DELETE_SINGLE_EPISODE, this.handlerDelete)
      this.$electron.ipcRenderer.removeListener(DELETE_ALL_VIDEO, this.handlerDelete)
    },

    methods: {
      /**
       * 获取所有本地的视频信息
       */
      handlerAllLocalVideoInfo (event, videoInfoList) {
        console.log('GET_ALL_LOCAL_VIDEO_INFO', videoInfoList)

        this.updateVideoInfoList(videoInfoList)
      },
      /**
       * 获取下载中的视频信息
       */
      handlerDownloadingVideoInfo (event, episodeInfoChangeList) {
        console.log('GET_DOWNLOADING_VIDEO_INFO', episodeInfoChangeList)

        for (let _id in episodeInfoChangeList) {
          if (!this.episodeInfoChangeList[_id]) this.$set(this.episodeInfoChangeList, _id, this.findEpisodeInfo({ _id }))

          deepMerge(this.episodeInfoChangeList[_id], episodeInfoChangeList[_id])

          // 当资源不在下载时，强制刷新videoInfoList
          if (!this.episodeInfoChangeList[_id].downloading) {
            this.updateVideoInfoList(this.$lodash.cloneDeep(this.videoInfoList))
          }
        }
      },
      /**
       * 打开播放页播放视频
       */
      playVideo ({ id, partId }) {
        this.$electron.ipcRenderer.send(PLAYER__OPEN_PLAYER, { id, partId })
      },
      /**
       * 下载
       */
      downloadVideo (episodeInfo) {
        console.log(episodeInfo)
        this.$electron.ipcRenderer.send(DOWNLOAD_VIDEO, episodeInfo)
      },
      /**
       * 暂停下载
       */
      pauseDownloadVideo (episodeInfo) {
        this.$electron.ipcRenderer.send(CANCEL_DOWNLOAD_VIDEO, { _id: episodeInfo._id })
      },
      /**
       * 删除
       */
      removeVideo (episodeInfo) {
        console.log('点击删除')
        this.$electron.ipcRenderer.send(DELETE_SINGLE_EPISODE, episodeInfo)
      },
      /**
       * 下载一部剧的其他剧集
       */
      downloadMoreVideo () {
        // for (let i = 0; i < 10; i++) {
        //   let num = 10 + i
        //   const url = 'http://bny.inkingpool.com/west/anime/56856/56856-1/play.m3u8?md5=92yYit0CDDwxvLgPxkFJSA&expires=1545056454&token=56856'
        //   const id = '001'
        //   const partId = `00${num}`

        //   this.$electron.ipcRenderer.send(DOWNLOAD_VIDEO, {
        //     type: 'm3u8',
        //     id,
        //     partId,
        //     url,
        //     name: '风味人间',
        //     part: num,
        //     partName: `第${num}集：香料歧路`,
        //     quality: '270p'
        //   })
        // }

        var quality = ['1080p', '270p', '480p', '720p']
        let idRandom = Math.ceil(Math.random() * 5)
        let partRandom = Math.ceil(Math.random() * 100)

        for (var i = 0; i < quality.length; i++) {
          const url = 'http://bny.inkingpool.com/west/anime/56856/56856-1/play.m3u8?md5=92yYit0CDDwxvLgPxkFJSA&expires=1545056454&token=56856'
          const id = idRandom
          const partId = partRandom

          this.$electron.ipcRenderer.send(DOWNLOAD_VIDEO, {
            type: 'm3u8',
            id,
            partId,
            url,
            name: `风味人间${idRandom}`,
            part: partRandom,
            partName: `第${partRandom}集：香料歧路`,
            quality: quality[i]
          })
        }
      },
      /**
       * 删除某部剧的所有剧集
       */
      deleteMoreVideo (episodeInfoList) {
        console.log('点击删除所有视频', episodeInfoList)
        this.$electron.ipcRenderer.send(DELETE_ALL_VIDEO, episodeInfoList)
      },
      /**
       * 通过id查找剧集信息
       */
      findEpisodeInfo ({ _id }) {
        for (let i = 0; i < this.videoInfoList.length; i++) {
          for (let j = 0; j < this.videoInfoList[i].length; j++) {
            if (this.videoInfoList[i][j]._id === _id) return this.videoInfoList[i][j]
          }
        }

        throw new Error('无法找到id所对应的 episodeInfo')
      },
      /**
       * 更新videoInfoList所需要的操作
       */
      updateVideoInfoList (videoInfoList) {
        this.videoInfoList = videoInfoList
        this.episodeInfoChangeList = {}
      },
      /**
       * 删除文件的回调
       */
      handlerDelete (event, { error, videoInfoList }) {
        if (error) {
          console.log(error)
          alert('文件删除出错，请尝试刷新页面')
        } else {
          console.log('删除成功')

          this.updateVideoInfoList(videoInfoList)
        }
      },
      /**
       * 下载所有暂停中的视频
       */
      downloadUnfinishedVideo () {
        this.$electron.ipcRenderer.send(DOWNLOAD_UNFINISHED_VIDEO)
      },
      /**
       * 暂停所有视频下载
       */
      pauseAllVideoDownload () {
        this.$electron.ipcRenderer.send(PAUSE_ALL_VIDEO_DOWNLOAD)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .download {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #3A3D40;

    .download__title {
      flex-shrink: 0;
      position: relative;
      display: flex;
      justify-content: center;
      height: 50px;
      line-height: 50px;
      margin: 0 20px;
      font-size: 14px;

      .left-function-button-list, .right-function-button-list {
        position: absolute;
        top: 50%;
        transform: translate(0, -50%);
        display: flex;

        &.left-function-button-list {
          left: 0;
        }

        &.right-function-button-list {
          right: 0;
        }

        & > div {
          cursor: pointer;

          &:not(:nth-child(1)) {
            margin-left: 30px;
          }
        }
      }

      .tab {
        display: flex;

        & > div {
          cursor: pointer;

          &:not(:nth-child(1)) {
            margin-left: 15px;
          }
        }
      }
    }

    .download__contanier {
      position: relative;
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      @include scrollbar();
    }

    i.iconfont {
      margin-right: 5px;
      font-size: 14px;
    }

    .list {
      .list__item {
        padding-bottom: 14px;

        &:nth-child(1) {
          border-top: 1px solid rgba(28, 30, 31, .5);
        }

        .video-info {
          display: flex;
          justify-content: space-between;
          padding: 16px 36px 16px 20px;
          background: #3A3D40;

          .video-info__info-warpper {
            display: flex;
            font-size: 14px;

            .video-info__info-pic {
              flex-shrink: 0;
              width: 80px;
              height: 112px;
              border-radius: 4px;
              margin-right: 12px;
            }

            .video-info__info-title {
              margin: 14px 0 10px;
            }

            .video-info__info-info {
              color: $secondary-text-color;
            }
          }

          .video-info__function-button-list {
            display: flex;
            align-items: center;
            font-size: 14px;

            .video-info__more {
              margin-right: 30px;
              cursor: pointer;
            }

            .video-info__delete {
              cursor: pointer;
            }
          }
        }
        
        .video-list {
          background: #333;
          
          .video-list__item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 60px;
            padding: 0 36px 0 55px;
            margin-left: 5px;
            font-size: 14px;

            &.complete {
              .video-list__item-right {
                width: 360px;
              }
            }

            .video-list__item-title {
              flex-shrink: 0;
              width: 240px;
              margin-right: 30px;
            }

            .video-list__item-progress {
              width: 100%;

              .video-list__item-progress__error {
                color: $orange;
              }

              .video-list__item-progress__progress-bar {
                width: 100%;
                height: 5px;
                background: #666;
                border-radius: 3px;
                overflow: hidden;

                .video-list__item-progress__progress-bar__mobi {
                  width: 0;
                  height: 100%;
                  background: $orange;
                }
              }
            }

            .video-list__item-right {
              flex-shrink: 0;
              display: flex;
              justify-content: space-between;
              margin-left: 60px;

              .video-list__item-size {
                color: $secondary-text-color;
              }

              .video-list__item-function-button-list {
                display: flex;

                & > div {
                  cursor: pointer;

                  &:not(:nth-child(1)) {
                    margin-left: 30px;
                  }
                }
              }
            }
          }
        }
      }
    }

    .empty {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -80%);
      text-align: center;

      .empty-title {
        margin: 16px 0 10px;
        font-size: 18px;
      }

      .empty-prompt {
        font-size: 14px;
        color: $secondary-text-color;
      }
    }
  }
</style>
