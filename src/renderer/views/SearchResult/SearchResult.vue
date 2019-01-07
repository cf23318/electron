<template>
  <div id="search-result">
    <div class="search-result__title">
      搜索“<font>{{name}}</font>”，共找到约 <font>{{number}}</font> 个视频
    </div>

    <div class="search-result__wrapper" v-if="number > 0" ref="wrapper">
      <div class="search-result__container">
        <div class="search-result__left">
          <div class="celebrity">
            <div class="celebrity-info__wrapper">
              <poster
                title="阿米尔汗"
                src="http://fscdn1.ytbbs.tv/2018/tv/20180925/960e1f377b286224ec46076730cf028d.jpg?x-oss-process=image/resize,w_380,h_532/sharpen,100/quality,Q_100"
                class="celebrity-avatar"
              ></poster>

              <div class="celebrity-info__container">
                <div class="celebrity-title">阿米尔汗</div>

                <div class="celebrity-layout">
                  <div>性别：男</div>
                  <div>星座：白羊座</div>
                  <div>出生年月：1954-04-07</div>
                </div>

                <div class="celebrity-layout">
                  <div>地区：中国 新疆 乌鲁木齐</div>
                  <div>职业：演员</div>
                </div>

                <div class="celebrity-introduction">简介：乾隆六年，少女魏璎珞为寻求长姐死亡真相，入紫禁城为宫女。经调查，璎珞证实姐姐之死与荒唐王爷弘昼有关，立志要讨回公道。富察皇后娴于礼法，担心璎珞走上歧途，竭力给予她温暖与帮助。在皇后的悉心教导下，魏璎珞一步步成长为正直坚强的宫廷女官，并放下怨恨、认真生活。皇 </div>

                <b-button class="celebrity-subscription" size="k-sm" variant="primary">已关注</b-button>
              </div>
            </div>

            <div class="celebrity__episode-list">
              <div class="celebrity__episode-list__nav">
                <b-button class="celebrity__episode-list__nav-item" size="k" variant="dark" :class="{'active': true}">全部</b-button>
                <b-button class="celebrity__episode-list__nav-item" size="k" variant="dark">电视剧</b-button>
                <b-button class="celebrity__episode-list__nav-item" size="k" variant="dark">电影</b-button>
              </div>

              <ul class="celebrity__episode-list__container">
                <li v-for="i in 5" :key="i">
                  <poster
                    title="猎毒人"
                    src="http://fscdn1.ytbbs.tv/2018/tv/20180925/960e1f377b286224ec46076730cf028d.jpg?x-oss-process=image/resize,w_380,h_532/sharpen,100/quality,Q_100"
                    prompt="猎毒人"
                    :score="7.9"
                  ></poster>
                </li>
              </ul>
            </div>
          </div>

          <ul class="episode-list">
            <li class="episode-list__item" v-for="i in 3" :key="i">
              <poster
                title="猎毒人"
                src="http://fscdn1.ytbbs.tv/2018/tv/20180925/960e1f377b286224ec46076730cf028d.jpg?x-oss-process=image/resize,w_380,h_532/sharpen,100/quality,Q_100"
                prompt="猎毒人"
                :score="7.9"
              ></poster>

              <div class="episode-list__item-container">
                <div class="episode-list__item-layout">
                  <div class="episode-list__item-layout__left">
                    <div class="episode-list__item-title">这是一个标题</div>
                    <div class="episode-list__item-time">(2018)</div>
                    <div class="episode-list__item-type">电视剧</div>
                  </div>

                  <div class="episode-list__item-heat">
                    <i class="iconfont icon-hot"></i>
                    234856
                  </div>
                </div>

                <div class="epusode-list__item-line">导演：二妞 米谢</div>
                <div class="epusode-list__item-line">演员：任君 谢明 孔芳芳</div>
                <div class="epusode-list__item-line">简介：乾隆六年，少女魏璎珞为寻求长姐死亡真相，入紫禁城为宫女。经调查，璎珞证实姐姐之死与荒唐王爷弘昼有关，立志要讨回公道。富察皇后娴于礼法，担心璎珞走上歧途，竭力给予她温暖与帮助。在皇后的悉心教导下，魏璎珞一步步成长为正直坚强的宫廷女官，并放下怨恨、认真生活。皇 </div>

                <template v-if="type === 'tv'">
                  <ul class="part-list__tv">
                    <li v-for="i in 28" :key="i">
                      <span v-text="i"></span>
                      <episode-mark v-show="i > 26" type="new"></episode-mark>
                    </li>
                    <li class="loda-more">更多</li>
                  </ul>
                </template>

                <template v-if="type === 'movie'">
                  <b-button class="play" size="k-lg" variant="primary">立即播放</b-button>
                </template>

                <template v-if="type === 'show'">
                  <ul class="part-list__show">
                    <li v-for="i in 5" :key="i" v-text="`${i}哈哈哈哈哈哈哈哈哈哈`"></li>
                    <li class="loda-more">更多</li>
                  </ul>
                </template>
              </div>
            </li>
          </ul>

          <b-pagination-nav
            class="b-pagination-custom"
            v-model="currentPage"
            align="center"
            :link-gen="linkGen"
            :number-of-pages="20"
            :limit="10"
            prev-text="上一页"
            next-text="下一页"
            hide-goto-end-buttons />
            <!-- https://github.com/bootstrap-vue/bootstrap-vue/issues/1629 -->
            <!-- https://github.com/bootstrap-vue/bootstrap-vue/pull/2299 -->
        </div>

        <search-popular @mousewheel="handlerSearchPopularMousewheel($event)"></search-popular>
      </div>
    </div>

    <div class="empty" v-show="number <= 0">
      <img class="empty-pic" src="~assets/images/download-empty.png" alt="" width="258" height="146">
      <div class="empty-title">抱歉，没有找到有关“<font>XXXXX</font>”相关的内容</div>
      <b-button size="k-md" variant="primary">我要求片</b-button>
    </div>
  </div>
</template>

<script>
  import SearchPopular from './SearchPopular.vue'
  import EpisodeMark from 'components/EpisodeMark.vue'

  export default {
    name: 'search-result',

    components: {
      SearchPopular,
      EpisodeMark
    },

    props: {
      name: {
        type: String,
        required: true
      },
      page: {
        type: [String, Number],
        default: 1
      }
    },

    data () {
      return {
        number: 19,
        type: 'tv',
        currentPage: 0
      }
    },

    watch: {
      page: {
        handler () {
          this.currentPage = parseInt(this.page)
        },
        immediate: true
      }
    },

    mounted () {
      console.log(this.name, this.page)
    },

    methods: {
      handlerSearchPopularMousewheel (event) {
        var delta = (event.wheelDelta) ? event.wheelDelta : -(event.detail || 0)

        this.$refs.wrapper.scrollTop -= delta
      },
      linkGen (pageNum) {
        return {
          name: 'search',
          query: {
            name: this.name,
            page: pageNum
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  #search-result {
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .search-result__title {
      flex-shrink: 0;
      width: 100%;
      height: 40px;
      line-height: 38px;
      padding: 0 20px;
      background: #333;
      font-size: 14px;

      & > font {
        color: $primary-color;
      }
    }

    .search-result__wrapper {
      overflow-x: hidden;
      overflow-y: auto;
      @include scrollbar();

      .search-result__container {
        position: relative;
        width: 955px;
        height: 100%;
        margin: 16px auto 0;

        .search-result__left {
          padding: 0 286px 30px 0;
        }
      }
          
      @media screen and (min-width: 1440px) {
        .search-result__container {
          width: 1277px;
        }
      }
    }

    .celebrity {
      padding: 20px 20px 30px 20px;
      margin-bottom: 30px;
      background: #323334;

      .celebrity-info__wrapper {
        position: relative;
        display: flex;

        .celebrity-avatar {
          flex-shrink: 0;
          width: 130px;
          margin-right: 14px;
        }

        .celebrity-title {
          color: $primary-text-color;
          font-size: 18px;
        }

        .celebrity-layout {
          display: flex;
          color: $secondary-text-color;
          font-size: 13px;
          @include notExceed();

          & > div {
            width: 33%;
            @include notExceed();
          }
        }

        .celebrity-introduction {
          color: $secondary-text-color;
          font-size: 13px;
        }
        
        .celebrity-subscription {
          position: absolute;
          bottom: 0;
        }
      }

      .celebrity__episode-list {
        margin-top: 22px;

        .celebrity__episode-list__nav {
          margin-bottom: 6px;

          .celebrity__episode-list__nav-item   {
            margin-right: 10px;
          }
        }

        .celebrity__episode-list__container {
          display: flex;
          flex-wrap: nowrap;
          overflow: hidden;
          
          li {
            flex-shrink: 0;
            width: 143px;
            
            &:not(:nth-child(1)) {
              margin-left: 19px;
            }
          }
        }
        
        @media screen and (min-width: 1440px) {
          .celebrity__episode-list__container {
            
            li {
              width: 175px;
            }
          }
        }
      }
    }

    .episode-list {
      width: 100%;

      .episode-list__item {
        display: flex;
        margin-bottom: 30px;

        .poster {
          flex-shrink: 0;
          width: 175px;
          margin-right: 20px;
        }
      }
    }

    .episode-list__item-container {
      position: relative;

      .episode-list__item-layout {
        display: flex;
        height: 28px;
        line-height: 28px;
        margin-bottom: 4px;

        .episode-list__item-layout__left {
          display: flex;
          width: 100%;

          .episode-list__item-title {
            margin-right: 12px;
            font-size: 18px;
            color: $regular-text-color;
          }

          .episode-list__item-time {
            margin-right: 12px;
            font-size: 16px;
            color: $secondary-text-color;
          }

          .episode-list__item-type {
            font-size: 14px;
            color: $secondary-text-color;
          }
        }

        .episode-list__item-heat {
          flex-shrink: 0;
          font-size: 18px;
          color: #FF6329;
        }
      }

      .epusode-list__item-line {
        line-height: 18px;
        margin-bottom: 4px;
        font-size: 13px;
        color: $secondary-text-color;
      }

      .part-list__tv {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        width: calc(100% + 8px);
        margin-top: 10px;

        li {
          position: relative;
          width: 40px;
          height: 38px;
          line-height: 36px;
          background: #333;
          margin: 0 8px 8px 0;
          text-align: center;
          cursor: pointer;

          &:hover {
            color: $primary-color;
          }

          &.loda-more {
            width: 88px;
          }
        }
      }

      .play {
        position: absolute;
        bottom: 0;
      }

      .part-list__show {
        display: flex;
        flex-wrap: wrap;
        margin-top: 10px;

        li {
          position: relative;
          width: 49%;
          height: 38px;
          line-height: 36px;
          padding: 0 10px;
          background: #333;
          border-radius: 2px;
          margin-bottom: 8px;
          cursor: pointer;
          font-size: 12px;
          @include notExceed();
          
          &:not(:nth-child(2n)) {
            margin-right: 2%;
          }

          &:hover {
            color: $primary-color;
          }

          &.loda-more {
            text-align: center;
          }
        }
      }
    }

    .empty {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -80%);
      text-align: center;

      .empty-title {
        margin: 16px 0 10px;
        font-size: 14px;

        font {
          color: $primary-color;
        }
      }

      .empty-prompt {
        font-size: 14px;
        color: $secondary-text-color;
      }
    }
  }
</style>
