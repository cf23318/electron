<template>
  <div class="history-record-popup">
    <div class="history-record-popup__history">
      <div class="history-record-popup__history__line"></div>

      <div v-for="i in 2" :key="i">
        <div class="history-record-popup__history__title">今天</div>

        <div class="history-record-popup__history__video-info" v-for="j in Math.ceil(parseInt(Math.random() * 6 + 1))" :key="j" @click="openVideo">
          <div class="history-record-popup__history__video-info__name">春风十里不如你</div>
          <div class="history-record-popup__history__video-info__prompt">观看至：第4集01:01</div>
        </div>
      </div>
    </div>

    <b-button class="history-record-popup__read-more" size="k" variant="primary">查看更多</b-button>
  </div>
</template>

<script>
  import { PLAYER__OPEN_PLAYER } from 'ipc-types'

  export default {
    name: 'history-record-popup',

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
  .header__history-record {

    &:hover {

      .history-record-popup {
        display: block;
      }
    }
  }

  .mac {

    .history-record-popup {
      transform: translate(calc(-50% - 50px), 0);

      &::before {
        left: calc(50% + 50px);
      }
    }
  }

  .history-record-popup {
    display: none;
    position: absolute;
    left: 50%;
    top: calc(100% + 6px);
    z-index: 999;
    transform: translate(calc(-50% + 1px), 0);
    width: 278px;
    background: #4F5154;

    &::before {
      content: '';
      position: absolute;
      left: 50%;
      top: -16px;
      border-left: 8px transparent solid;
      border-right: 8px transparent solid;
      border-top: 8px transparent solid;
      border-bottom: 8px #4F5154 solid;
    }

    .history-record-popup__history {
      position: relative;
      // padding: 0 13px 0 21px;
      line-height: 26px;
      font-size: 12px;

      .history-record-popup__history__line {
        position: absolute;
        left: 10px;
        top: 12px;
        bottom: 0;
        width: 1px;
        background: $primary-color;
      }

      .history-record-popup__history__title {
        position: relative;
        padding-left: 19px;
        color: $primary-color;

        &::before {
          content: '';
          position: absolute;
          left: 6px;
          top: 9px;
          width: 9px;
          height: 9px;
          border: 2px solid #4F5154;
          border-radius: 50%;
          background: $primary-color;
        }
      }

      .history-record-popup__history__video-info {
        display: flex;
        justify-content: space-between;
        padding: 0 13px 0 21px;
        cursor: pointer;

        &:hover {
          color: $primary-text-hover-color;
        }

        .history-record-popup__history__video-info__prompt {
          color: $secondary-text-color;
        }
      }
    }

    .history-record-popup__read-more {
      display: block;
      margin: 10px auto;
    }
  }
</style>
