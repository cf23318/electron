<template>
  <div class="filter">
    <div class="responsive">
      <div class="filter-type-wapper">
        <div class="filter-type__layout" v-for="filterInfo in filterList" :key="filterInfo.name">
          <div class="filter-type__name" v-text="`${filterInfo.name}: `"></div>

          <div class="filter-type__list">
            <div class="filter-type__list-item" v-for="(name, index) in filterInfo.list" :key="name" :class="{active: index === 0}" v-text="name"></div>
          </div>
        </div>
      </div>

      <div class="filter-list">
        <poster-wrap
          v-for="key in 30"
          :key="key"
          width="175px"
          title="哈哈哈"
          src="http://fscdn1.ytbbs.tv/2018/tv/20180925/960e1f377b286224ec46076730cf028d.jpg?x-oss-process=image/resize,w_380,h_532/sharpen,100/quality,Q_100"
          prompt="猎毒人"
          :score="7.9"
        ></poster-wrap>
      </div>

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
  </div>
</template>

<script>
  import PosterWrap from 'components/PosterWrap.vue'

  export default {
    name: 'page-filter',

    components: {
      PosterWrap
    },

    props: {
      channel: {
        type: String,
        default: '电视剧'
      },
      area: {
        type: String,
        default: '全部'
      },
      age: {
        type: String,
        default: '全部'
      },
      type: {
        type: String,
        default: '全部'
      },
      sort: {
        type: String,
        default: '最热'
      },
      page: {
        type: [String, Number],
        default: 1
      }
    },

    data () {
      return {
        filterList: [
          {
            name: '频道',
            list: ['电视剧', '电影']
          },
          {
            name: '地区',
            list: ['全部', '大陆', '欧美']
          },
          {
            name: '年代',
            list: ['全部', '2019', '2018']
          },
          {
            name: '类型',
            list: ['全部', '古装', '武侠']
          },
          {
            name: '排序',
            list: ['最热', '最新', '高分']
          }
        ],
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

    methods: {
      linkGen (pageNum) {
        return {
          name: 'filter',
          query: {
            channel: this.channel,
            area: this.area,
            age: this.age,
            type: this.type,
            sort: this.sort,
            page: pageNum
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .filter {
    padding-bottom: 20px;

    .filter-type-wapper {
      padding: 20px 30px;
      background: #42444A;
      margin-top: 10px;

      .filter-type__layout {
        display: flex;

        &:not(:nth-last-child(1)) {
          margin-bottom: 10px;
        }

        .filter-type__name {
          flex-shrink: 0;
          width: 48px;
          font-size: 14px;
        }

        .filter-type__list {
          display: flex;
          width: 100%;

          .filter-type__list-item {
            height: 22px;
            line-height: 22px;
            padding: 0 8px;
            border-radius: 11px;
            font-size: 14px;
            cursor: pointer;

            &:not(:nth-child(1)) {
              margin-left: 4px;
            }

            &.active {
              color: $primary-text-active-color;
              background: #323334;
            }
          }
        }
      }
    }

    .filter-list {
      display: flex;
      flex-wrap: wrap;
      width: calc(100% + 20px);
      margin-top: 20px;
      
      .poster-wrap {
        margin: 0 20px 20px 0;
      }
    }
  }
</style>
