<template>
  <div class="related-video-list">
    <div class="title" v-text="title"></div>

    <ul class="list">
      <li class="item active" v-for="item in list" :key="item">
        <div class="item__figure">
          <img src="http://fscdn1.ytbbs.tv/2018/tv/20181101/2a2309e4f45892459f6ee4b484cb0d55.jpg?x-oss-process=image/resize,w_380,h_532/sharpen,100/quality,Q_100">
          <div>全30集</div>
        </div>
        <p title="猎毒人">猎毒人</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'player-related-video-list',

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
  .related-video-list {
    width: 258px;
    margin: 0 auto 10px;

    .title {
      height: 46px;
      line-height: 45px;
      margin: 0 4px;
      font-size: 14px;
      color: $primary-text-color;
    }

    .list {
      display: flex;
      flex-wrap: wrap;
      
      .item {
        flex-shrink: 0;
        width: 80px;
        height: 138px;
        border-radius: 2px;
        overflow: hidden;
        cursor: pointer;

        &:not(:nth-child(1)):not(:nth-child(2)):not(:nth-child(3)) {
          margin-top: 20px;
        }

        &:not(:nth-child(3n-2)) {
          margin-left: 9px;
        }

        .item__figure {
          position: relative;

          & > img {
            flex-shrink: 0;
            width: 80px;
            height: 112px;
            border-radius: 4px;
            overflow: hidden;
          }

          & > div {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 27px;
            line-height: 28px;
            padding: 0 4px;
            background: linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,1) 100%);
            font-size: 12px;
            @include notExceed();
          }
        }

        & > p {
          height: 20px;
          line-height: 19px;
          margin-top: 6px;
          font-size: 14px;
          color: $primary-text-color;
          @include notExceed();
        }
      }
    }
  }
</style>
