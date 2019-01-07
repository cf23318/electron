<template>
  <div class="episode" :class="type">
    <template v-if="type === 'video'">
      <div class="episode-filter">
        <div class="episode-filter__arrow left iconfont icon-left-arrow" @click="moveLeft"></div>

        <ul class="episode-filter__list" ref="episodeFilter">
          <li class="episode-filter__item">1-50</li>
          <li class="episode-filter__item">51-100</li>
          <li class="episode-filter__item">101-150</li>
          <li class="episode-filter__item">151-200</li>
          <li class="episode-filter__item">201-250</li>
          <li class="episode-filter__item">251-300</li>
          <li class="episode-filter__item">301-350</li>
          <li class="episode-filter__item">351-400</li>
          <li class="episode-filter__item">401-450</li>
        </ul>

        <div class="episode-filter__arrow right iconfont icon-right-arrow" @click="moveRight"></div>
      </div>

      <div class="episode-list">
        <div class="episode-list__layout" v-for="key in 10" :key="key">
          <div class="episode-list__item" v-for="key2 in 5" :key="key2" v-text="key2" :class="{active: key == 1 && key2 == 1}"></div>
        </div>
      </div>
    </template>

    <template v-if="type === 'variety'">
      <ul class="episode-list">
        <li class="active" title="20181006：总决赛制作人帮唱燥然舞台">20181006：总决赛制作人帮唱燥然舞台</li>
        <li title="20181006：总决赛制作人帮唱燥然舞台总决赛制作人帮唱燥然舞台">20181006：总决赛制作人帮唱燥然舞台20181006：总决赛制作人帮唱燥然舞台</li>
      </ul>

      <div class="load-more" @click="showPopup">全部</div>

      <div class="episode-list-popup" :class="{show: visiblePopup}" @click="hidePopup">
        <div class="episode-list-popup__layout">
          <div class="episode-list-popup__title-layout">
            <div class="episode-list-popup__title" title="中国新说唱中国新说唱中国新说唱中国新说唱">中国新说唱中国新说唱中国新说唱中国新说唱</div>

            <div class="episode-list-popup__prompt">选集</div>
          </div>

          <div class="episode-list-popup__fold" @click="hidePopup">收起</div>
        </div>

        <ul class="episode-list episode-list-popup__list">
          <li class="active" title="20181006：总决赛制作人帮唱燥然舞台">20181006：总决赛制作人帮唱燥然舞台舞台舞台</li>
          <li v-for="key in 30" :key="key" title="20181006：总决赛制作人帮唱燥然舞台">20181006：总决赛制作人帮唱燥然舞台</li>
        </ul>
      </div>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'player-episode',

    props: {
      type: {
        type: String,
        required: true,
        validator (value) {
          return ['video', 'variety'].includes(value)
        }
      }
    },

    data () {
      return {
        visiblePopup: true
      }
    },

    methods: {
      moveLeft () {
        this.$refs.episodeFilter.scrollLeft -= this.$refs.episodeFilter.getBoundingClientRect().width
      },
      moveRight () {
        this.$refs.episodeFilter.scrollLeft += this.$refs.episodeFilter.getBoundingClientRect().width
      },
      showPopup () {
        this.visiblePopup = true
      },
      hidePopup () {
        this.visiblePopup = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .episode {
    margin-top: 12px;

    &.video {
      .episode-filter {
        display: flex;
        width: 250px;
        height: 30px;
        line-height: 29px;
        background: rgba(255, 255, 255, .1);
        border-radius: 15px;

        .episode-filter__list {
          display: flex;
          flex-wrap: nowrap;
          width: 200px;
          text-align: center;
          font-size: 12px;
          color: $secondary-text-color;
          overflow: hidden;

          .episode-filter__item {
            flex-shrink: 0;
            width: 50px;
            cursor: pointer;

            &:hover {
              color: $primary-color;
            }
          }
        }

        .episode-filter__arrow {
          width: 25px;
          text-align: center;
          font-size: 12px;
          cursor: pointer;
        }
      }

      .episode-list {
        margin-top: 10px;

        .episode-list__layout {
          display: flex;
          justify-content: space-between;

          &:not(:nth-child(1)) {
            margin-top: 12px;
          }

          .episode-list__item {
            width: 42px;
            height: 24px;
            line-height: 23px;
            border-radius: 12px;
            text-align: center;
            cursor: pointer;

            &.active {
              background: rgba(255,255,255,0.1);
              color: $primary-color;
            }
          }
        }
      }
    }

    &.variety {
      .episode-list {
        & > li {
          position: relative;
          height: 30px;
          line-height: 30px;
          padding-left: 12px;
          font-size: 13px;
          cursor: pointer;
          @include notExceed();

          &.active {
            color: $primary-color;

            &::before {
              content: '';
              position: absolute;
              left: 0;
              top: 50%;
              transform: translate(0, -50%);
              width: 0;
              height: 0;
              border-left: 8px solid $primary-color;
              border-right: 8px solid transparent;
              border-top: 6px solid transparent;
              border-bottom: 6px solid transparent;
            }
          }
        }
      }

      .load-more {
        height: 28px;
        line-height: 27px;
        background: rgba(255, 255, 255, .1);
        border-radius: 4px;
        margin-top: 8px;
        text-align: center;
        font-size: 12px;
        cursor: pointer;
      }
    }

    .episode-list-popup {
      display: flex;
      flex-direction: column;
      position: absolute;
      left: 0;
      right: 0;
      bottom: -100%;
      width: 100%;
      height: 100%;
      padding-top: 6px;
      background: #2A2827;

      &.show {
        bottom: 0;
        transition: .3s;
      }

      .episode-list-popup__layout {
        flex-shrink: 0;
        display: flex;
        justify-content: space-between;
        height: 30px;
        line-height: 29px;
        padding: 0 16px;
        margin-bottom: 8px;
      
        .episode-list-popup__title-layout {
          display: flex;
          width: 194px;
          font-size: 18px;

          .episode-list-popup__title {
            @include notExceed();
          }
          
          .episode-list-popup__prompt {
            flex-shrink: 0;
            display: inline-block;
            margin-left: 15px;
          }
        }

        .episode-list-popup__fold {
          width: auto;
        }

        .episode-list-popup__fold {
          font-size: 13px;
          cursor: pointer;
        }
      }

      .episode-list-popup__list {
        padding: 0 16px 20px;
        overflow-x: hidden;
        overflow-y: auto;
        @include scrollbar(#555555);
      }
    }
  }
</style>
