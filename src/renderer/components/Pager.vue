<template>
  <div class="pager">
    <div class="pager_content">
      <span class="pager__number" v-if="needPageNumber">
        <span class="pager__number__current" v-text="currentPage"></span> / <span class="pager__number__total" v-text="totalPage"></span>
      </span>
      <div class="pager__action">
        <span class="pager__action__prev" @click="prevPage" :style="pagerCustomStyle"><i class="iconfont icon-left-arrow"></i></span>
        <span class="pager__action__next" @click="nextPage" :style="[pagerCustomStyle, { 'margin-left': pagerCustomMarginLeft }]"><i class="iconfont icon-right-arrow"></i></span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'pager',

    props: {
      needPageNumber: {
        type: Boolean,
        required: true
      },
      currentPage: {
        type: Number,
        required: true
      },
      totalPage: {
        type: Number,
        required: true
      },
      pagerCustomSize: {
        type: Number,
        required: false
      }
    },

    data () {
      return {
        pagerCustomStyle: {},
        pagerCustomMarginLeft: '4px'
      }
    },

    created () {
      if (this.pagerCustomSize > 0) {
        this.pagerCustomStyle = {
          width: this.pagerCustomSize + 'px',
          height: this.pagerCustomSize + 'px',
          lineHeight: this.pagerCustomSize + 'px',
          fontSize: this.pagerCustomSize / 2 + 'px'
        }
        this.pagerCustomMarginLeft = `${Math.max(this.pagerCustomSize / 3, 4)}px`
      }
    },

    methods: {
      prevPage: function () {
        if (this.currentPage > 1) {
          this.$emit('update:currentPage', this.currentPage - 1)
        }
      },

      nextPage: function () {
        if (this.currentPage < this.totalPage) {
          this.$emit('update:currentPage', this.currentPage + 1)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .pager {
    display: inline-block;
    vertical-align: middle;
    
    .pager_content {
      display: flex;
      justify-content: space-between;
    }

    .pager__number {
      font-size: 14px;
      line-height: 1;
      margin-right: 4px;
    }

    .pager__action {
      font-size: 0;

      .pager__action__prev, .pager__action__next {
        display: inline-block;
        width: 14px;
        height: 14px;
        line-height: 14px;
        font-size: 7px;
        text-align: center;
        border-radius: 100%;
        background: #4e5053;
        cursor: pointer;

        &:hover {
          color: #fff;
          background: $light-blue;
        }

        i {
          font-size: inherit;
        }
      }
    }
  }
</style>

