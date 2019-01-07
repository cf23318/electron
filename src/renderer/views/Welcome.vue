<template>
  <div id="welcome">
    <h2>这是个欢迎页，可以用来展示loading 存放数据等...</h2>
    <div>一秒后跳转至首页</div>
  </div>
</template>

<script>
  import store from 'store'
  import { SETTING__SET_ASIDE_NAV } from 'store-types'

  export default {
    name: 'welcome',

    mounted () {
      this.getAllInfo()
    },

    methods: {
      getAllInfo () {
        console.log('getAllInfo')

        this.$store.dispatch(SETTING__SET_ASIDE_NAV, {
          asideNav: [
            {
              id: '10000',
              name: '精选'
            },
            {
              id: '10001',
              name: '电视剧'
            },
            {
              id: '10002',
              name: '电影'
            },
            {
              url: '/filter?page=1',
              name: '筛选'
            }
          ]
        })

        setTimeout(() => {
          this.$router.replace({name: 'home'})
        }, 500)
      }
    },

    beforeRouteEnter (to, from, next) {
      if (store.state.setting.asideNav.length) {
        next({name: 'home'})
      } else {
        next()
      }
    }
  }
</script>

<style lang="scss" scoped>
  #welcome {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    white-space: nowrap;
  }
</style>
