<template>
  <div class="search-popular">
    <div class="search-popular__title">热门搜索</div>

    <div class="search-popular__layout">
      <ul class="search-popular__popular-list">
        <li class="search-popular__popular-list__item" v-for="(i, index) in 5" :key="i" :title="`${i}.哈哈啊哈哈啊哈哈啊哈哈啊`" @click="openVideo">
          <i class="search-popular__popular-list__item-ranking" v-text="`${index + 1}.`"></i>
          <span v-text="`${i}哈哈啊哈哈啊哈哈啊哈哈啊`"></span>
        </li>
      </ul>

      <ul class="search-popular__popular-list">
        <li class="search-popular__popular-list__item" v-for="(i, index) in 5" :key="i" :title="`${i}.哈哈啊哈哈啊哈哈啊哈哈啊`" @click="openVideo">
          <i class="search-popular__popular-list__item-ranking" v-text="`${index + 6}.`"></i>
          <span v-text="`${i}哈哈啊哈哈啊哈哈啊哈哈啊`"></span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { PLAYER__OPEN_PLAYER } from 'ipc-types'

  export default {
    name: 'search-popular',

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
  .search-popular {
    line-height: 30px;
    padding: 13px 0 13px;
    margin: 0 10px;
    font-size: 14px;

    .search-popular__title {
      margin: 0 8px;
      color: $secondary-text-color;
    }

    .search-popular__layout {
      display: flex;
      justify-content: space-between;
    }

    .search-popular__popular-list {
      
      &:nth-child(1) {

        .search-popular__popular-list__item:nth-child(1) {
          .search-popular__popular-list__item-ranking {
            color: #FF1E0D;
          }
        }

        .search-popular__popular-list__item:nth-child(2) {
          .search-popular__popular-list__item-ranking {
            color: #FF5C37;
          }
        }

        .search-popular__popular-list__item:nth-child(3) {
          .search-popular__popular-list__item-ranking {
            color: #FFB026;
          }
        }
      }

      .search-popular__popular-list__item {
        flex-shrink: 0;
        width: 170px;
        padding: 0 10px;
        cursor: pointer;
        @include notExceed();

        &:hover {
          background: #323334;
          color: $primary-color;
        }

        .search-popular__popular-list__item-ranking {
          display: inline-block;
          width: 14px;
          margin-right: 4px;
          font-family: 'alternategothic2bt';
          color: #9B9B9B;
          text-align: right;
        }
      }
    }
  }
</style>
