<template>
  <div class="celebrity-details">
    <div class="people">
      <div class="name">艾米</div>

      <div class="subscription">关注</div>
    </div>

    <related-video-list title="代表作品" :list="[1, 2, 3, 4, 5, 6]"></related-video-list>
  </div>
</template>

<script>
  import RelatedVideoList from './RelatedVideoList.vue'

  export default {
    name: 'player-celebrity-details',

    components: {
      RelatedVideoList
    },

    props: {
      celebrityId: {
        type: String,
        id: true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .celebrity-details {
    .people {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .name {
        font-size: 26px;
      }

      .subscription {
        height: 26px;
        line-height: 25px;
        padding: 0 22px;
        background: linear-gradient(90deg, rgba(0,196,255,1) 0%, rgba(0,157,255,1) 100%);
        border-radius: 15px;
        font-size: 14px;
        cursor: pointer;
      }
    }
  }
</style>
