<template>
  <div class="video-details">
    <div class="layout">
      <img src="http://fscdn1.ytbbs.tv/2018/tv/20180510/7e35bb11b2dfc6a39990f7aed6e9529a.jpg?x-oss-process=image/resize,w_380,h_532/sharpen,100/quality,Q_100" alt="">

      <div class="info">
        <div class="name">火王之破壁之战</div>
        <div class="score">7.6</div>

        <div class="other-info">年份：2018</div>
        <div class="other-info">累心：古装</div>
        <div class="other-info">地区：内地</div>
      </div>
    </div>

    <div class="introduction">
      <div class="title">简介</div>
      <p class="content">因为家族企业遇到经营困境，厉致诚临危受命，成为一家企业的负责人，并且因此邂逅刚出校门、创业碰壁的都市白领林浅。由于厉致诚全无商业经验，所以企业内外部都不看好这位总裁。林浅是一位非常正直善良的女性,凭借自己的职场经验和理想追求,给予厉致诚很大帮助。厉致诚将用自己的智慧和独特方法运用到企业的实际经营中，竟令企业起死回生，并且一步步走向辉煌；</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'player-video-details'
}
</script>

<style lang="scss" scoped>
  .video-details {
    padding: 0 16px;

    .layout {
      display: flex;
      justify-content: space-between;
      margin-bottom: 24px;

      & > img {
        flex-shrink: 0;
        width: 124px;
        height: 170px;
        margin-right: 9px;
      }

      .info {
        width: 100%;
      }

      .name {
        line-height: 1em;
        margin-bottom: 6px;
        font-size: 16px;
      }

      .score {
        line-height: 1em;
        margin-bottom: 17px;
        font-size: 22px;
        color: $primary-color;
      }

      .other-info {
        line-height: 1em;
        margin-bottom: 8px;
        font-size: 13px;
        color: $secondary-text-color;
      }
    }

    .introduction {
      .title {
        margin-bottom: 8px;
        font-size: 14px;
      }

      .content {
        font-size: 12px;
        color: $secondary-text-color;
      }
    }
  }
</style>
