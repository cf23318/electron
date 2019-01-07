<template>
  <div class="poster" :title="title" @click="handlerClick($event)" :style="{width: width, 'cursor': isPointer ? 'pointer' : 'default'}">
    <div class="poster-layout">
      <img class="poster-pic" :src="src" :alt="alt">

      <div class="poster-mask" v-if="prompt || score">
        <p class="poster-prompt" v-text="prompt"></p>
        <i class="poster-score" v-text="score"></i>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'poster',

    props: {
      title: String,
      src: {
        type: String,
        required: true
      },
      alt: String,
      width: String,
      // height: String,
      prompt: String,
      score: Number,
      href: String,
      onClick: Function
    },

    computed: {
      isPointer () {
        return this.href || this.onClick
      }
    },

    methods: {
      handlerClick (event) {
        if (this.href) {
          this.$router.push(this.href)
        } else if (this.onClick) {
          this.onClick(event)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .poster {
    position: relative;
    width: auto;
    height: auto;

    .poster-layout {
      position: relative;
      width: 100%;
      height: 0px;
      padding-bottom: 140%;
    }

    .poster-pic {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 0;
      width: 100%;
      height: 100%;
      border-radius: 4px;
    }

    .poster-mask {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 0;
      width: 100%;
      height: 18.4%;
      line-height: 28px;
      background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(51,51,51,1) 100%);
      border-radius: 0 0 4px 4px;
      font-size: 12px;
      @include notExceed();
    }

    .poster-prompt {
      position: absolute;
      left: 4px;
      bottom: 0;
      z-index: 0;
      margin: 0;
    }

    .poster-score {
      position: absolute;
      right: 4px;
      bottom: 0;
      z-index: 0;
      margin: 0;
    }
  }
</style>
