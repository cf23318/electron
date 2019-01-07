<template>
  <div class="poster-wrap">
    <poster
      v-bind="$attrs"
      :width="width"
      :onClick="openVideo"
    ></poster>

    <div class="poster__detail">
      <p class="poster__title">全职法师 第3季</p>
      <div class="poster__desc">法师集结，决战狂魔</div>
    </div>
  </div>
</template>

<script>
  import { PLAYER__OPEN_PLAYER } from 'ipc-types'

  export default {
    name: 'poster-wrap',

    props: {
      width: {
        type: String,
        default: '175px'
      }
    },

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
  .poster__detail {

    .poster__title {
      line-height: 22px;
      font-size: .875rem;
      margin: 8px 0 0;
      cursor: pointer;

      &:hover {
        color: $blue;
      }
    }

    .poster__desc {
      color: $secondary-text-color;
      font-size: .75rem;
    }
  }
</style>
