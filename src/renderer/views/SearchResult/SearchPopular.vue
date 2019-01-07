<template>
  <div class="search-popular" @mousewheel="handlerMousewheel($event)">
    <div class="search-popular-layout">
      <div class="search-popular__header-title">热门搜索</div>

      <div class="search-popular__list">
        <a class="search-popular__list-item" v-for="i in 10" :key="i" href="javascript:;">
          <i class="search-popular__list-item__ranking" v-text="i"></i>
          <div class="search-popular__list-item__name">正阳门下</div>
          <div class="search-popular__list-item__heat">
            <i class="iconfont icon-hot"></i>
            1901
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'search-popular',

    methods: {
      handlerMousewheel (event) {
        this.$emit('mousewheel', event)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .search-popular {
    position: absolute;
    right: 0;
    top: 0;
    width: 270px;

    .search-popular-layout {
      position: fixed;
      width: 270px;
    }

    .search-popular__header-title {
      font-size: 18px;
      color: $primary-text-color;
    }

    .search-popular__list {
      margin-top: 16px;
      
      .search-popular__list-item {
        display: flex;
        height: 22px;
        line-height: 22px;
        margin-bottom: 15px;
        color: $primary-text-color;
        font-size: 14px;

        &:nth-child(1) {
          .search-popular__list-item__ranking {
            background: #FF1E0D;
          }
        }

        &:nth-child(2) {
          .search-popular__list-item__ranking {
            background: #FF5C37;
          }
        }

        &:nth-child(3) {
          .search-popular__list-item__ranking {
            background: #FFB026;
          }
        }

        .search-popular__list-item__ranking {
          flex-shrink: 0;
          width: 22px;
          height: 22px;
          background: #666666;
          border-radius: 2px;
          margin-right: 10px;
          text-align: center;
          font-family: 'alternategothic2bt';
        }

        .search-popular__list-item__name {
          flex-shrink: 0;
          width: 130px;
          @include notExceed();
        }

        .search-popular__list-item__heat {
          width: 100%;
          text-align: right;
          color: #FF6329;
          @include notExceed();
        }
      }
    }
  }
</style>
