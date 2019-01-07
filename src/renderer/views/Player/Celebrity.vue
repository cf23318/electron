<template>
  <div class="celebrity">
    <ul class="celebrity-list">
      <li v-for="key in 4" :key="key">
        <img src="http://fscdn1.ytbbs.tv/actor/2014370-456d2f82a3e7b9c91e36d77754d7b83a.jpg?x-oss-process=image/resize,w_240,h_240/sharpen,100/quality,Q_100" alt="">
        <div>艾米</div>
      </li>
    </ul>

    <celebrity-details celebrityId="123"></celebrity-details>
  </div>
</template>

<script>
  import CelebrityDetails from './CelebrityDetails.vue'

  export default {
    name: 'player-celebrity',

    components: {
      CelebrityDetails
    },

    props: {
      // 剧id
      id: {
        type: String,
        required: true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .celebrity {
    padding: 0 16px;

    .celebrity-list {
      display: flex;
      justify-content: space-between;
      margin-bottom: 14px;

      li {
        position: relative;
        width: 52px;
        height: 80px;
        line-height: 22px;
        font-size: 12px;
        color: $primary-color;
        text-align: center;
        cursor: pointer;

        &:after {
          content: '';
          position: absolute;
          left: 50%;
          bottom: 0;
          transform: translate(-50%, 0);
          width: 20px;
          height: 2px;
          background: $primary-color;
        }

        & > img {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          overflow: hidden;
          object-fit: cover;
        }
      }
    }
  }
</style>
