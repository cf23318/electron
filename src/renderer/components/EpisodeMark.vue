<template>
  <img v-if="type" class="episode-mark" :class="type" :src="src">
</template>

<script>
  import episodeMarkNew from '@/assets/images/episode-mark-new.png'
  import episodeMarkAdvance from '@/assets/images/episode-mark-advance.png'

  export default {
    name: 'episode-mark',

    props: {
      type: {
        type: String,
        validator (value) {
          return ['new', 'advance'].includes(value)
        }
      }
    },

    computed: {
      src () {
        switch (this.type) {
          case 'new':
            return episodeMarkNew
          case 'advance':
            return episodeMarkAdvance
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .episode-mark {
    position: absolute;
    right: 0;
    top: 0;
    
    &.new {
      width: 12px;
      height: 12px;
      line-height: 12px;
      background: #EC4844;
      border-radius: 2px;
    }

    &.advance {
      width: 12px;
      height: 12px;
      line-height: 12px;
      background: #BBBBBB;
      border-radius: 2px;
    }
  }
</style>
