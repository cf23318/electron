<template>
  <div class="playlist">
    <div class="layout-container">
      <div class="title-box">
        <h2 class="title">火王之破壁之战</h2>

        <i class="score">7.5</i>
      </div>

      <div class="hint">周一到周五，每天更新2集</div>

      <ul class="tags">
        <li class="tag__item">电视机</li>
        <li class="tag__item">内地</li>
        <li class="tag__item">2018</li>
        <li class="tag__item">剧情</li>
        <li class="tag__item">奇幻</li>
        <li class="tag__item">test</li>
        <li class="tag__item">test</li>
      </ul>

      <episode type="video"></episode>
      <!-- <episode type="variety"></episode> -->
    </div>

    <related-short-film-list title="MV" :list="[1, 2, 3]"></related-short-film-list>
    <related-short-film-list title="精彩花絮" :list="[1, 2, 3]"></related-short-film-list>
    <related-video-list title="大家都在看" :list="[1, 2, 3, 4, 5, 6]"></related-video-list>
  </div>
</template>

<script>
  import Episode from './Episode.vue'
  import RelatedShortFilmList from './RelatedShortFilmList.vue'
  import RelatedVideoList from './RelatedVideoList.vue'

  export default {
    name: 'player-play-list',

    components: {
      Episode,
      RelatedShortFilmList,
      RelatedVideoList
    }
  }
</script>

<style lang="scss" scoped>
  .playlist {
    .layout-container {
      padding: 0 16px;
    }
    
    .title-box {
      display: flex;
      justify-content: space-between;
      line-height: 1em;

      .title {
        margin-bottom: 0;
        font-size: 18px;
      }

      .score {
        font-style: normal;
        font-size: 16px;
        color: $primary-color;
      }
    }

    .hint {
      font-size: 12px;
      color: $secondary-text-color;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      margin-top: 5px;

      .tag__item {
        display: inline-block;
        width: auto;
        height: 24px;
        line-height: 23px;
        padding: 0 8px;
        background: rgba(255, 255, 255, .1);
        border-radius: 12px;
        margin: 5px 6px 0 0;
        font-size: 12px;
        color: $secondary-text-color;
      }
    }
  }
</style>
