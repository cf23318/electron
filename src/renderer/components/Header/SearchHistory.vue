<template>
  <div class="search-history">
    <div class="search-history__title">
      <div class="search-history__title-text">历史纪录</div>
      <div class="iconfont icon-delete search-history__title-delete"></div>
    </div>

    <ul class="search-history__history-list">
      <li class="search-history__history-list__item" v-for="i in 10" :key="i" v-text="`哈哈啊哈哈啊哈哈啊哈哈啊`" title="`哈哈啊哈哈啊哈哈啊哈哈啊`" @click="openVideo"></li>
    </ul>

    <hr class="search-history__line">
  </div>
</template>

<script>
  import { PLAYER__OPEN_PLAYER } from 'ipc-types'

  export default {
    name: 'search-history',

    methods: {
      openVideo: function () {
        this.$electron.ipcRenderer.send(PLAYER__OPEN_PLAYER, {
          id: '0001',
          partId: '0002'
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .search-history {
    line-height: 30px;
    padding-top: 5px;
    margin: 0 10px;
    font-size: 14px;

    .search-history__title {
      display: flex;
      justify-content: space-between;
      margin: 0 8px;
      color: $secondary-text-color;

      .search-history__title-delete {
        cursor: pointer;
        font-size: 14px;
      }
    }

    .search-history__history-list {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      .search-history__history-list__item {
        flex-shrink: 0;
        width: 170px;
        padding: 0 10px;
        cursor: pointer;
        @include notExceed();

        &:hover {
          background: #323334;
          color: $primary-color;
        }
      }
    }

    .search-history__line {
      margin: 13px 8px 0;
      border-color: #333333;
    }
  }
</style>
