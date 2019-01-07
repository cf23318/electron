<template>
  <div class="window-action" v-if="visible" :class="[system, { 'popup': isPopup }]">
    <template v-if="system === 'win'">
      <div v-if="displayMin && !isPopup" class="min-button iconfont icon-win-minimize" @click="minimize"></div>
      <div v-if="displayMax && !isPopup" :class="['max-button', 'iconfont', isMaximize ? 'icon-win-maximize-restore' : 'icon-win-maximize']" @click="maximize"></div>
      <div v-if="displayClose" class="close-button iconfont icon-win-combinedshape" @click="close"></div>
    </template>

    <template v-if="system === 'mac'">
      <div v-if="displayClose" class="close-button iconfont icon-mac-combinedshape" @click="close"></div>
      <div v-if="displayMin && !isPopup" class="min-button iconfont icon-mac-minimize" @click="minimize"></div>
      <div v-if="displayMax && !isPopup" :class="['max-button', 'iconfont', isMaximize ? 'icon-mac-maximize-restore' : 'icon-mac-maximize']" @click="maximize"></div>
    </template>
  </div>
</template>

<script>
  import { isWin } from 'utils/utils'

  export default {
    name: 'window-action',

    props: {
      system: {
        type: String,
        required: true
      },
      displayMin: {
        type: Boolean,
        default: true
      },
      displayMax: {
        type: Boolean,
        default: true
      },
      displayClose: {
        type: Boolean,
        default: true
      },
      // 是否是弹窗，如果是弹窗的话，只显示一个关闭按钮，并且定位在左(右)上角
      isPopup: {
        type: Boolean,
        default: false
      }
    },

    data () {
      return {
        isMaximize: false
      }
    },

    computed: {
      visible () {
        var system = isWin ? 'win' : 'mac'
        return this.system === system
      }
    },

    created () {
      const window = this.$electron.remote.getCurrentWindow()

      this.isMaximize = window.isMaximized()

      window.on('maximize', () => {
        this.isMaximize = true
      })
  
      window.on('unmaximize', () => {
        this.isMaximize = false
      })
    },

    methods: {
      minimize () {
        this.$electron.remote.getCurrentWindow().minimize()
      },
      maximize () {
        const window = this.$electron.remote.getCurrentWindow()

        if (!window.isMaximized()) {
          window.maximize()
        } else {
          window.unmaximize()
        }
      },
      close () {
        this.$electron.remote.getCurrentWindow().close()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .window-action {
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    overflow: hidden;

    &.win {
      color: #bbbbbb;
      
      & > div {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        text-align: center;
        -webkit-app-region: no-drag;

        &:not(:nth-child(1)) {
          margin-left: 12px;
        }
      }
    }

    &.mac {
      & > div {
        flex-shrink: 0;
        width: 12px;
        height: 12px;
        line-height: 12px;
        border-radius: 50%;
        text-align: center;
        -webkit-app-region: no-drag;

        &:not(:nth-child(1)) {
          margin-left: 8px;
        }
      }

      .close-button {
        background: #e46358;
      }

      .min-button {
        background: #f6be4f;
      }

      .max-button {
        background: #62c655;
      }
    }

    &.popup {
      position: absolute;
      top: 0;
      height: 30px;

      &.win {
        right: 5px;
      }

      &.mac {
        left: 10px;
      }
    }

    & > div {
      cursor: pointer;
    }
  }
</style>
