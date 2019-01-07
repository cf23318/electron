<template>
  <div id="player">
    <header id="player__header">
      <div id="player__header-left">
        <window-action system="mac" style="margin-right: 26px;"></window-action>

        <div id="open-main-page" @click="openMainPage">打开主页面</div>
      </div>

      <h1 class="title">火王之破壁之战: {{id}}-{{partId}}</h1>

      <div id="player__header-right">
        <div id="download-video" class="iconfont icon-download" @click="openDownloadWindow"></div>
        <div id="topping" class="iconfont icon-stick" @click="topping"></div>

        <window-action system="win" style="margin-left: 12px;"></window-action>
      </div>
    </header>

    <div id="player__container" @mouseenter="showOtherContainerButton" @mouseleave="hideOtherContainerButton">
      <div id="video__wrapper">
        <div id="video__container" v-once></div>

        <div id="visible-other-container" :class="{show: visibleOtherContainerButton}" @click="toggleOtherContainer"></div>
      </div>

      <div id="other__container" :class="{show: visibleOtherContainer}">
        <template v-if="$store.state.setting.networkStatus">
          <ul id="other__tab">
            <li :class="{active: tabIndex === 1}" @click="changeTab(1)">播放列表</li>
            <li :class="{active: tabIndex === 2}" @click="changeTab(2)">明星</li>
            <li :class="{active: tabIndex === 3}" @click="changeTab(3)">详情</li>
          </ul>

          <div id="other__tab-container">
            <!-- <div v-if="tabIndex === 1">
              <button @click="player1">播放1</button>
              <button @click="player2">播放2</button>
            </div> -->

            <play-list v-if="tabIndex === 1"></play-list>

            <celebrity v-if="tabIndex === 2" id="123"></celebrity>

            <video-details v-if="tabIndex === 3"></video-details>
          </div>
        </template>

        <div class="player__network-offline" v-if="!$store.state.setting.networkStatus">
          当前处于离线状态
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import WindowAction from 'components/WindowAction.vue'
  import playList from './playList.vue'
  import Celebrity from './Celebrity.vue'
  import VideoDetails from './VideoDetails.vue'

  import path from 'path'
  import '../../../../static/player/manifest.js'
  import '../../../../static/player/vendor.js'
  import '../../../../static/player/app.js'
  import { deepMerge, fixLocalFilePath } from 'utils/utils'
  import { PLAYER__OPEN_DOWNLOAD } from 'ipc-types'

  export default {
    name: 'player',

    components: {
      WindowAction,
      playList,
      Celebrity,
      VideoDetails
    },

    props: {
      id: {
        type: String,
        required: true
      },
      partId: {
        type: String,
        required: true
      }
    },

    data () {
      return {
        tabIndex: 1,
        visibleOtherContainer: true,
        visibleOtherContainerButton: false
      }
    },

    watch: {
      id () {
        this.changeVideo()
      },
      partId () {
        this.changeVideo()
      }
    },

    created () {
      this.$electron.ipcRenderer.on('changeVideo', this.handlerChangeVideo)
    },

    mounted () {
      console.log('player id: ', this.id, this.partId)

      this.player1()
    },

    methods: {
      player1 () {
        // this.player(path.join(this.$electron.remote.app.getPath('videos'), `/kantv-video/video/mp4.mp4`))
        // this.player(path.join(`C:/Users/Administrator/Videos/`, `/kantv-video/video/mp4.mp4`))
        // this.player(`C:/Users/Administrator/Videos/kantv-video/video/mp4.mp4`)
        // this.player(`http://127.0.0.1:5500/video/mp4.mp4`)
        // this.player(`http://bny.inkingpool.com/west/tv/8213/8213-4/play.m3u8?md5=JoVqMp_gleWbOPZ_NZ__Ig&expires=1543934973&token=8213`)
        // console.log(path.join(this.$electron.remote.app.getPath('videos'), `/kantv-video/001/002/play.m3u8`))
        // this.player(path.join(this.$electron.remote.app.getPath('videos'), `/kantv-video/001/002/play.m3u8`))
        console.log(path.join(this.$electron.remote.app.getPath('videos'), `/kantv-video/风味人间/风味人间 第一集：香料歧路 270p/play.m3u8`))
        // this.player(path.join(this.$electron.remote.app.getPath('videos'), `/kantv-video/风味人间/风味人间 第一集：香料歧路 270p/play.m3u8`))
        this.player(path.join(this.$electron.remote.app.getPath('videos'), `/kantv-video/风味人间/风味人间 第1集：香料歧路 270p/play.m3u8`))
      },
      player2 () {
        // this.player(path.join(this.$electron.remote.app.getPath('videos'), `/kantv-video/video/m3u82/play.m3u8`))
        // this.player(path.join(`C:/Users/Administrator/Videos/`, `/kantv-video/video/m3u82/play.m3u8`))
        // this.player(`C:/Users/Administrator/Videos/kantv-video/video/m3u82/play.m3u8`)
        // this.player(`http://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8`)
        this.player(`http://bny.inkingpool.com/west/tv/8213/8213-3/play.m3u8?md5=17JoPHJQ4wywuje6wX46oA&expires=1543936360&token=8213`)
      },
      openMainPage () {
        alert('open main page')
      },
      changeTab (index) {
        this.tabIndex = index
      },
      player (url) {
        if (!window.userAgent) window.userAgent = {}
        Object.deepMerge(window.userAgent, {
          isPc: true,
          isMobi: false
        })
  
        window.currentPartInfo = {
          'playerType': 'extVjs',

          'customControl': {
            'controlBar': 'bottom',
            'isScreenshot': false,
            'isPageFullscreen': false
          },

          'playerBox': '#video__container',
          'seo': 'series',
          'isLogin': 1,
          'id': '301806544865001',
          'part_id': '101806544865002',
          'playGenus': 10344, // ['10344' 正片, '10345' 花絮, '10346' MV, '10340' 预告]
          'part': 2,
          'title': '扶摇 第一集',
          'minPart': 1,
          'prologue': 10,
          'epilogue': -10,
          'nextPartReverse': false,
          'logo': 'http://www.svn.imkan.tv:233/tpl_pc/assets/imgs/default_country/video_loading.gif',
          'defaultLogo': 'http://www.svn.imkan.tv:233/tpl_pc/assets/imgs/default_country/video_loading.gif',
          // 'history': {
          //   'sec': 28,
          //   'part_id': 101806544865003,
          //   'part': 3
          // },
          // 'wxSubscribe': {
          //   'time': 0,
          //   'timeout': 180,
          //   'code': '445689',
          //   'qrCode': 'http://www.svn.imkan.tv:233/tpl_pc/assets/imgs/default_country/test_wechat_qrcode.jpg',
          //   'defaultQrCode': 'http://www.svn.imkan.tv:233/tpl_pc/assets/imgs/default_country/test_wechat_qrcode.jpg',
          //   'pcExample': 'http://www.svn.imkan.tv:233/tpl_pc/assets/imgs/default_country/video_subscription-example.jpg',
          //   'mobiExample': 'http://www.svn.imkan.tv:233/tpl_pc/assets/imgs/default_country/video_subscription-wap-example.png',
          //   'name': '看看..',
          //   'id': 'xxx'
          // },
          'country': {
            'code': 'UA',
            'name': '澳洲'
          },
          'advertising': {
            'pause': [],
            'closeMandatory': true,
            'recordHistoryMandatoryAd': false,
            'mandatory': {
              '0': []
            }
          },
          // 'collect': {
          //   'displayState': true,
          //   'isCollect': false
          // },
          'url': {
            // 'sendBarrage': '/danmu/post',
            // 'getBarrage': '/danmu/pop',
            // 'error': '/reportError',
            // 'watchHistory': '/User/viewSec',
            // 'shareDomainName': 'http://share.tenrry.com',
            // 'shareParam': '/qrcode/getQrcodeparm',
            // 'share': '/User/usershare',
            // 'wxSubscribe': '/newChannel/wxSubscribe'
          },
          'expansion': {
            'click': this.toggleOtherContainer
          },

          'requestFullscreen': this.playerQequestFullscreen, // 全屏
          'exitFullscreen': this.playerExitFullscreen, // 退出全屏
          'isFullscreen': this.playerIsFullscreen, // 当前是否全屏
          'changeControlBarDisplayState': this.playerChangeControlBarDisplayState // 改变控制栏显示状态时产生的回调函数
        }

        window.vjsChangeVideoArgs = function (args) {
          if (args.tvid && args._id) {
            if (window.currentPartInfo.keepHistory) {
              window.currentPartInfo.keepHistory = false
            } else {
              if (args.history && args.history.part_id && args.history.part) {
                deepMerge(window.currentPartInfo, {
                  history: args.history
                })
              } else {
                window.currentPartInfo.history = {}
              }
            }

            // 播放器：切换剧集时，切换当前集的信息
            deepMerge(window.currentPartInfo, {
              playUrl: args.url,
              first: false,
              'part_id': args._id,
              currentPartNum: args.part,
              prologue: args.prologue,
              epilogue: args.epilogue,
              uid: args.danmu ? args.danmu.uid : null,
              pid: args.danmu ? args.danmu.pid : null,
              ptk: args.danmu ? args.danmu.ptk : null
            })
          }
        }

        function vjsPlayUrl (url) {
          url = fixLocalFilePath(url)
          window.currentPartInfo.playUrl = url
          window.vjsPlay(url)
        }

        // 正常
        // vjsPlayUrl('http://192.168.20.126:8080/static/video/mp4.mp4')
        // vjsPlayUrl('http://192.168.20.126:8080/static/video/m3u8/play.m3u8')

        vjsPlayUrl(url)
      },
      openDownloadWindow () {
        this.$electron.ipcRenderer.send(PLAYER__OPEN_DOWNLOAD, {
          id: this.id
        })
      },
      topping () {
        alert('暂未实现!')
      },
      toggleOtherContainer () {
        this.visibleOtherContainer = !this.visibleOtherContainer
      },
      playerQequestFullscreen () {
        document.querySelector('#player__container').webkitRequestFullscreen()
      },
      playerExitFullscreen () {
        return false
      },
      playerIsFullscreen () {
        return this.$electron.remote.getCurrentWindow().isFullScreen()
      },
      playerChangeControlBarDisplayState (state) {
        this.visibleOtherContainerButton = state
      },
      showOtherContainerButton () {
        this.visibleOtherContainerButton = true
      },
      hideOtherContainerButton () {
        this.visibleOtherContainerButton = false
      },
      /**
       * 监听来自主进程的播放事件
       */
      handlerChangeVideo (event, { id, partId }) {
        console.log('handlerChangeVideo', { id, partId })
  
        // replace 只会更改 props，不会触发任何 hook，watch的除外
        this.$router.replace({
          name: 'player',
          params: {
            id,
            partId
          }
        })
      },
      /**
       * 改变播放地址
       */
      changeVideo () {
        console.log('change')
      }
    }
  }
</script>

<style>
  @import '../../../../static/player/app.css';

  .vjs-custom-player.vjs-fullscreen {
    position: static;
  }
</style>

<style lang="scss" scoped>
  #player {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  #player__header {
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 46px;
    line-height: 46px;
    padding: 0 22px;
    background: #323334;
    -webkit-app-region: drag;

    #player__header-left {
      display: flex;

      #open-main-page {
        font-size: 12px;
        cursor: pointer;
        -webkit-app-region: no-drag;
      }
    }

    .title {
      font-size: 15px;
      line-height: 46px;
    }

    #player__header-right {
      display: flex;
      align-items: center;
      text-align: center;

      .iconfont {
        cursor: pointer;
        width: 20px;
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        -webkit-app-region: no-drag;

        &:not(:nth-child(1)) {
          margin-left: 12px;
        }
      }
    }
  }

  #player__container {
    position: relative;
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    overflow: hidden;

    #video__wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      background: #10100F;
      overflow: hidden;
    }

    #video__container {
      width: 100%;
      height: 100%;
    }

    #visible-other-container {
      // visibility: hidden;
      opacity: 0;
      position: absolute;
      right: 0;
      top: 50%;
      z-index: 1000;
      transform: translate(0, -50%);
      width: 22px;
      height: 120px;
      background: rgba(100, 100, 100, .7);
      border-radius: 5px 0 0 5px;
      cursor: pointer;
      transition: .4s;

      &.show {
        opacity: 1;
      }
    }

    #other__container {
      flex-shrink: 0;
      position: relative;
      // display: flex;
      display: none;
      flex-direction: column;
      width: 290px;
      height: 100%;
      background: #2A2827;
      overflow: hidden;

      &.show {
        display: flex;
      }

      #other__tab {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        height: 50px;
        padding: 0 16px;
        font-size: 14px;

        li {
          position: relative;
          height: 34px;
          line-height: 34px;
          margin-right: 16px;
          cursor: pointer;

          &.active {
            color: $primary-color;

            &::before {
              display: block;
            }
          }

          &::before {
            display: none;
            content: '';
            position: absolute;
            left: 50%;
            bottom: 0px;
            transform: translate(-50%, 0);
            width: 20px;
            height: 2px;
            background: $primary-color;
          }
        }
      }

      #other__tab-container {
        overflow-x: hidden;
        overflow-y: auto;
        @include scrollbar(#555555);
      }
    }
  }
</style>
