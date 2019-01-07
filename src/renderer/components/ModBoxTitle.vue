<template>
  <div class="mod-box__hd">
    <div class="title" v-text="title"></div>

    <ul class="title__tab">
      <li v-for="item in filter" :key="item">{{item}}</li>
    </ul>

    <div class="mod-box__hd-paging">
      <pager :currentPage.sync="currentPage" :totalPage="totalPage" :needPageNumber="true"></pager>
    </div>
  </div>
</template>

<script>
  import Pager from 'components/Pager.vue'

  export default {
    name: 'mod-box-title',

    components: {
      Pager
    },

    props: {
      title: {
        type: String,
        required: true
      },
      filter: {
        type: Array,
        required: true
      }
    },

    data: function () {
      return {
        currentPage: 1,
        totalPage: 6
      }
    }
  }
</script>

<style lang="scss" scoped>
  .mod-box__hd {
    color: #fff;
    text-align: left;
    padding: 18px 0;
    font-size: 0;

    .title {
      position: relative;
      display: inline-block;
      vertical-align: middle;
      margin: 0 18px 0 0;
      font-size: 1.25rem;
      line-height: 1;
      padding-left: 10px;

      &:before {
        content: '';
        position: absolute;
        left: 0;
        top: 10%;
        width: 2px;
        height: 80%;
        border-radius: 2px;
        background: $blue;
      }
    }

    .title__tab {
      display: inline-block;
      vertical-align: middle;
      font-size: 0;

      li {
        display: inline-block;
        font-size: .875rem;
        line-height: 1;
        margin-right: 14px;
        cursor: pointer;

        &:hover {
          color: $blue;
        }
      }
    }

    .mod-box__hd-paging {
      float: right;
      padding: 3px 0;
    }
  }
</style>

