<template>
  <div class="mod-box responsive">
    <mod-box-title :title="title" :filter="filter"></mod-box-title>

    <div class="mod-box__bd">
      <ul class="figure__list">
        <li class="list__item" v-for="i in 15" :key="i">
          <poster-wrap
            width="175px"
            title="哈哈哈"
            src="http://fscdn1.ytbbs.tv/2018/tv/20180925/960e1f377b286224ec46076730cf028d.jpg?x-oss-process=image/resize,w_380,h_532/sharpen,100/quality,Q_100"
            prompt="猎毒人"
            :score="7.9"
          ></poster-wrap>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import ModBoxTitle from 'components/ModBoxTitle.vue'
  import PosterWrap from 'components/PosterWrap.vue'

  import { PLAYER__OPEN_PLAYER } from 'ipc-types'

  export default {
    name: 'mod-box',

    components: {
      ModBoxTitle,
      PosterWrap
    },

    props: {
      filter: {
        type: Array,
        required: true
      },
      title: {
        type: String,
        required: true
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
  .mod-box {

    .mod-box__bd {

      .figure__list {
        width: calc(100% + 20px);
        text-align: left;

        .list__item {
          display: inline-block;
          margin: 0 20px 20px 0;
          width: 175px;

          &:hover {

            .figure__title {
              color: $blue !important;
            }
          }
        }
      }
    }
  }
</style>
