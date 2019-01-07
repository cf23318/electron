<template>
  <div class="download-window">
    <div class="download-window__header">
      <window-action system="mac" :isPopup="true"></window-action>
      <window-action system="win" :isPopup="true"></window-action>

      <div class="download-window__header-text">
        <div class="download-window__title">一起同过窗</div>
        <div class="download-window__header-prompt">（更新至15集/共50集）</div>
      </div>

      <div class="select-episode">
        <div class="episode-list">
          <b-button class="episode-list__item" size="k-sm" :pressed="true" variant="dark" v-for="i in 4" :key="i" v-text="`${i * 50 - 50}-${i * 50}`"></b-button>
        </div>
        <div class="episode-paging">
          <pager :currentPage.sync="currentPage" :totalPage="totalPage" :needPageNumber="false" :pagerCustomSize="pagerCustomSize"></pager>
        </div>
      </div>
    </div>

    <div class="download-window__container">
      <!-- 电视剧 -->
      <ul class="tv" v-if="type === 'tv'">
        <li v-for="i in 50" :key="i" :class="{active: i === 2, downloading: i === 3, downloadEnd: i === 4}">
          <i class="iconfont" :class="{'icon-downloading': i === 3, 'icon-success': i === 4}"></i>
          <span v-text="i"></span>
          <episode-mark type="new"></episode-mark>
        </li>
      </ul>

      <!-- 综艺 -->
      <ul class="show" v-if="type === 'show'">
        <li v-for="i in 8" :key="i" :class="{active: i === 2, downloading: i === 3, downloadEnd: i === 4}">
          <i class="iconfont" :class="{'icon-downloading': i === 3, 'icon-success': i === 4}"></i>
          <span v-text="`${i}哈哈哈哈`"></span>
          <episode-mark type="new"></episode-mark>
        </li>
      </ul>
    </div>

    <div class="download-window__footer">
      <b-form-checkbox-group v-model="selectAll">
        <b-form-checkbox value="all">全选</b-form-checkbox>
      </b-form-checkbox-group>

      <b-button :disabled="true" class="download-window__start-download" size="k" variant="primary">开始下载</b-button>
    </div>
  </div>
</template>

<script>
  import WindowAction from 'components/WindowAction.vue'
  import Pager from 'components/Pager.vue'
  import EpisodeMark from 'components/EpisodeMark.vue'

  import { GET_ALL_LOCAL_VIDEO_INFO } from 'ipc-types'

  export default {
    name: 'download-window',

    components: {
      WindowAction,
      Pager,
      EpisodeMark
    },

    props: {
      id: {
        type: String,
        required: true
      }
    },

    data () {
      return {
        type: 'show',
        selectAll: [],
        currentPage: 1,
        totalPage: 6,
        pagerCustomSize: 24,
        videoInfoList: []
      }
    },

    created () {
      // 获取所有信息
      this.$electron.ipcRenderer.send(GET_ALL_LOCAL_VIDEO_INFO)
      this.$electron.ipcRenderer.on(GET_ALL_LOCAL_VIDEO_INFO, this.handlerAllLocalVideoInfo)
    },

    mounted () {
      console.log('download window id: ', this.id)
    },

    beforeDestroy () {
      this.$electron.ipcRenderer.removeListener(GET_ALL_LOCAL_VIDEO_INFO, this.handlerAllLocalVideoInfo)
    },

    methods: {
      /**
       * 获取所有本地的视频信息
       */
      handlerAllLocalVideoInfo (event, videoInfoList) {
        console.log('GET_ALL_LOCAL_VIDEO_INFO', videoInfoList)

        this.videoInfoList = videoInfoList
      }
    }
  }
</script>

<style lang="scss" scoped>
  .download-window {
    overflow: hidden;

    .download-window__header {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      align-content: center;
      height: 82px;

      .download-window__header-text {
        flex-shrink: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        align-content: center;
        flex-wrap: wrap;
        width: 100%;
        line-height: 22px;
        text-align: center;

        .download-window__title {
          font-size: 14px;
        }

        .download-window__header-prompt {
          font-size: 12px;
          color: $secondary-text-color;
        }
      }

      .select-episode {
        flex-shrink: 0;
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding: 10px 20px 0;
        text-align: center;

        .episode-list {
          display: flex;
          width: 100%;

          .episode-list__item {
            width: 74px;

            &:not(:nth-child(1)) {
              margin-left: 15px;
            }
          }
        }

        .episode-paging {
          flex-shrink: 0;
          display: flex;
          width: 56px;
        }
      }
    }

    .download-window__container {
      height: 222px;
      background: #2A2827;
      overflow: hidden;

      & > ul {
        width: 100%;
        height: 100%;

        li {

          &.active {
            border: 1px solid $primary-color;
            // box-shadow: 0px 0px 0px 1px $primary-color;
            color: $primary-color;
          }

          &.downloading, &.downloadEnd {
            color: $secondary-text-color;
            cursor: not-allowed;

            &:hover {
              color: $secondary-text-color;
            }
  
            i.icon-downloading, i.icon-success {
              position: absolute;
              left: 5px;
              bottom: 5px;
              width: 8px;
              height: 8px;
              line-height: 8px;
              font-size: 8px;
            }
          }
  
          &.downloading {
            i.icon-downloading, i.icon-success {
              color: $blue;
            }
          }
  
          &.downloadEnd {
            i.icon-downloading, i.icon-success {
              color: $orange;
            }
          }
        }
      }

      .tv {
        display: flex;
        flex-wrap: wrap;
        padding: 18px 22px;
        text-align: center;

        li {
          position: relative;
          width: 42px;
          height: 34px;
          line-height: 32px;
          border-radius: 4px;
          cursor: pointer;

          &:not(:nth-child(10n-9)) {
            margin-left: 4px;
          }

          &:not(:nth-child(-n+10)) {
            margin-top: 4px;
          }

          &.downloading, &.downloadEnd {
            i.icon-downloading, i.icon-success {
              left: 1px;
              bottom: 1px;
            }
          }
        }
      }

      .show {
        padding: 18px 20px 0;
        overflow-y: auto;
        @include scrollbar();

        li {
          position: relative;
          height: 34px;
          line-height: 32px;
          padding: 0 18px;
          border-radius: 4px;
          cursor: pointer;
          @include notExceed();

          &:not(:nth-child(1)) {
            margin-bottom: 4px;
          }

          &:nth-last-child(1) {
            margin-bottom: 18px;
          }
          
          &:hover {
            color: $primary-color;
          }

          &.downloading, &.downloadEnd {
            i.icon-downloading, i.icon-success {
              left: 0;
              bottom: 13px;
            }
          }
        }
      }
    }

    .download-window__footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 56px;
      padding: 0 20px;

      .download-window__start-download {
        font-size: 14px;
      }
    }
  }
</style>
