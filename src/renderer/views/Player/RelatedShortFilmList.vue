<template>
  <div class="related-short-film-list">
    <div class="title" v-text="title"></div>

    <ul class="list">
      <li class="item" v-for="item in list" :key="item">
        <img src="http://fscdn1.ytbbs.tv/2018/tv/20180821/cbce93e1f87db6379635bed90c5ff9ef.jpg?x-oss-process=image/resize,w_380,h_220/sharpen,100/quality,Q_100">
        <p title="《如懿传》主题曲《双影》张惠妹林忆莲两大天后重磅献唱">《如懿传》主题曲《双影》张惠妹林忆莲两大天后重磅献唱</p>
      </li>
    </ul>

    <!-- <div class="button" @click="handlerClick">全部</div> -->
  </div>
</template>

<script>
export default {
  name: 'player-related-short-film-list',

  props: {
    title: {
      type: String,
      required: true
    },
    list: {
      type: Array,
      required: true
    }
  },

  methods: {
    handlerClick () {
      this.$emit('on-click', this.list)
    }
  }
}
</script>

<style lang="scss" scoped>
  .related-short-film-list {
    width: 250px;
    margin: 0 auto 10px;

    .title {
      height: 46px;
      line-height: 45px;
      font-size: 14px;
      color: $primary-text-color;
    }

    .list {
      .item {
        display: flex;
        border: 1px solid transparent;
        border-radius: 2px;
        overflow: hidden;
        cursor: pointer;

        &:not(:nth-child(1)) {
          margin-top: 8px;
        }

        &.active {
          border-color: $primary-color;
        }

        & > img {
          flex-shrink: 0;
          width: 120px;
          height: 68px;
          border-radius: 2px;
          margin-right: 10px;
          overflow: hidden;
        }

        & > p {
          height: 40px;
          margin-top: 4px;
          font-size: 14px;
          color: $primary-text-color;

          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }

    .button {
      height: 28px;
      line-height: 27px;
      border-radius: 4px;
      background: rgba(255, 255, 255, .1);
      margin-top: 20px;
      text-align: center;
      cursor: pointer;
      font-size: 12px;
    }
  }
</style>
