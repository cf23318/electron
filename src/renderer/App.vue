<template>
  <div id="app" :class="system">
    <aside-nav v-if="!meta.hideAsideNav"></aside-nav>

    <main id="app__container">
      <page-header v-if="!meta.hideHeader"></page-header>

      <router-view class="app__wrapper"></router-view>
    </main>
  </div>
</template>

<script>
  import Header from 'components/Header/Header.vue'
  import AsideNav from 'components/AsideNav.vue'

  import { SETTING__SET_NETWORK_STATUS } from 'store-types'
  import { isWin, isMac } from 'utils/utils'

  export default {
    name: 'app',

    components: {
      PageHeader: Header,
      AsideNav
    },

    computed: {
      meta () {
        return this.$route.meta
      },

      system () {
        if (isWin) return 'win'
        if (isMac) return 'mac'
        return 'other'
      }
    },

    watch: {
      system: {
        handler (newVal, oldVal) {
          document.body.classList.remove(oldVal)
          document.body.classList.add(newVal)
        },
        immediate: true
      }
    },

    created () {
      this.setOnlineStatus()
  
      /**
       * 多窗口时，每个窗口都会向vuex发送请求，并且每次请求都会被转发至所有窗口 O(n^2)
       * 目前未优化
       */
      window.addEventListener('online', this.setOnlineStatus)
      window.addEventListener('offline', this.setOnlineStatus)
  
      this.$electron.ipcRenderer.on('AppUpdater-message', (event, msg) => {
        console.log('AppUpdater-message', msg)
      })
    },

    beforeDestroy () {
      window.removeEventListener('online', this.setOnlineStatus)
      window.removeEventListener('offline', this.setOnlineStatus)
    },

    methods: {
      setOnlineStatus () {
        this.$store.dispatch(SETTING__SET_NETWORK_STATUS, { networkStatus: navigator.onLine })
      }
    }
  }
</script>

<style>
  @import "https://at.alicdn.com/t/font_935497_f4oyjpsjr1.css";
  @import "~assets/fonts/alternategothic2bt/alternategothic2bt.css";
</style>

<style lang="scss">
  @import "~assets/scss/var.scss";
  @import "node_modules/bootstrap/scss/bootstrap";
</style>

<style>
  @import "~bootstrap-vue/dist/bootstrap-vue.css";

  body {
    overflow: hidden;
    background-color: #3A3D40;

    &.mac {
      border-radius: 5px;
      background: transparent;
    }
  }
</style>

<style lang="scss">
  @import "~assets/scss/global.scss";
</style>

<style lang="scss" scoped>
  #app {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    color: #fff;
  }

  #app__container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }

  .app__wrapper {
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    @include scrollbar();
  }
</style>
