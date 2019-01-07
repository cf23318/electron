import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: require('views/Welcome.vue').default,
      meta: { hideAsideNav: true, hideHeader: true }
    },
    {
      path: '/home/10000',
      name: 'home',
      component: require('views/Home').default,
      props: { id: '10000' },
      meta: { asideNavId: '10000' }
    },
    {
      path: '/home/10001',
      name: 'tvdrama',
      component: require('views/Tvdrama').default,
      props: { id: '10001' },
      meta: { asideNavId: '10001' }
    },
    {
      path: '/home/10002',
      name: 'movie',
      component: require('views/Movie').default,
      props: { id: '10002' },
      meta: { asideNavId: '10002' }
    },
    {
      path: '/player/:id/:partId',
      name: 'player',
      component: require('views/Player/Player.vue').default,
      props: true,
      meta: { hideAsideNav: true, hideHeader: true }
    },
    {
      path: '/download',
      name: 'download',
      component: require('views/Download.vue').default
    },
    {
      path: '/downloadWindow/:id',
      name: 'downloadWindow',
      component: require('views/DownloadWindow.vue').default,
      props: true,
      meta: { hideAsideNav: true, hideHeader: true }
    },
    {
      path: '/search',
      name: 'search',
      component: require('views/SearchResult/SearchResult.vue').default,
      props: (route) => ({ name: route.query.name, page: route.query.page || 1 })
    },
    {
      path: '/login',
      name: 'login',
      component: require('views/Login.vue').default,
      meta: { hideAsideNav: true, hideHeader: true }
    },
    {
      path: '/filter',
      name: 'filter',
      component: require('views/Filter.vue').default,
      props: (route) => ({
        channel: route.query.channel,
        area: route.query.area,
        age: route.query.age,
        type: route.query.type,
        sort: route.query.sort,
        page: route.query.page
      })
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
