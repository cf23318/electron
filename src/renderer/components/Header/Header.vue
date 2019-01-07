<template>
  <header class="header">
    <!-- <router-link id="go-home" to="welcome">go home</router-link> -->

    <!-- https://github.com/electron/electron/issues/1354#issuecomment-300860582 -->
    <div class="header__no-drag"></div>

    <div class="header__logo-wrapper">
      <img class="header__logo" src="~assets/images/logo.png" alt="">
    </div>

    <form class="header__search" @submit="search">
      <b-input ref="input" class="transparent header__search__input" name="search" v-model="searchValue" :placeholder="searchPlaceholder" :formatter="limitWordCount"></b-input>
      <button ref="submit" class="header__search__submit" name="submit">
        <i class="iconfont icon-search"></i>
        <span>搜索</span>
      </button>

      <search-popup></search-popup>
    </form>

    <div class="header__right">
      <div class="iconfont icon-refresh"></div>
      <div class="header__history-record">
        <div class="iconfont icon-record"></div>

        <history-record-popup></history-record-popup>
      </div>
      <div class="iconfont icon-collect"></div>
      <div class="iconfont icon-downloadfile" @click="$router.push({name: 'download'})"></div>

      <window-action system="win" style="margin-left: 18px;"></window-action>
    </div>
  </header>
</template>

<script>
  import WindowAction from 'components/WindowAction.vue'
  import SearchPopup from './SearchPopup.vue'
  import HistoryRecordPopup from './HistoryRecordPopup.vue'

  export default {
    name: 'page-header',

    components: {
      WindowAction,
      SearchPopup,
      HistoryRecordPopup
    },

    data () {
      return {
        searchValue: '',
        searchPlaceholder: ''
      }
    },

    // watch: {
    //   // 方案二
    //   $route () {
    //     this.$refs.input.$el.blur()
    //     this.$refs.submit.blur()
    //   }
    // },

    created () {
      this.searchPlaceholder = '我不是药神'
    },

    methods: {
      // 限制字数
      limitWordCount (value) {
        return value.substring(0, 30)
      },
      search (event) {
        event.preventDefault()
        this.$refs.input.$el.blur()
        this.$refs.submit.blur()

        let value = (this.searchValue || this.searchPlaceholder).trim()

        if (!value) return

        this.$router.push({name: 'search', query: { name: value, page: 1 }})
      }
    }
  }
</script>

<style lang="scss" scoped>
  .header {
    position: relative;
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 50px;
    padding-right: 22px;
    line-height: 50px;
    background: #3a3d40;
    -webkit-app-region: drag;

    &:focus-within {
      .header__no-drag {
        display: block;
      }
    }

    .header__no-drag {
      display: none;
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: -1;
      -webkit-app-region: no-drag;
    }

    .go-home {
      position: absolute;
      left: 0;
      top: 0;
      height: 1.3em;
      line-height: 1.3em;
      font-size: 12px;
      cursor: pointer;
      -webkit-app-region: no-drag;
    }

    .header__logo-wrapper {
      display: flex;
      align-items: center;
      width: 125px;
      height: 100%;
      padding-left: 22px;

      .header__logo {
        width: 54px;
        height: 20px;
      }
    }

    .header__search {
      position: relative;
      display: flex;
      justify-content: space-between;
      width: 400px;
      height: 34px;
      line-height: 32px;
      border-radius: 17px;
      background: #313236;
      font-size: 14px;
      vertical-align: middle;
      -webkit-app-region: no-drag;

      .header__search__input {
        width: 100%;
        height: 100%;
        padding: 0 15px;
        background: transparent;
        border: none;
        color: #fff;
        outline: none;
        font-size: 14px;
      }

      .header__search__submit {
        flex-shrink: 0;
        width: 80px;
        height: 32px;
        margin: 1px 1px 0 0;
        line-height: 29px;
        border-radius: 17px;
        background: #494b50;
        border: none;
        color: $primary-color;
        outline: none;
        cursor: pointer;
        text-align: center;
        font-size: 14px;

        .icon-search {
          position: relative;
          top: 1px;
        }
      }
    }

    .header__right {
      display: flex;
      height: 100%;

      .iconfont {
        margin-left: 18px;
        -webkit-app-region: no-drag;
        cursor: pointer;
      }

      .header__history-record {
        position: relative;
      }
    }
  }

  #app.win {
    
    .header {
      left: -125px;
      width: calc(100% + 125px);

      .header__logo-wrapper {
        background: #4D5053;
      }
    }
  }
</style>
