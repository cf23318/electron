import Vue from 'vue'

import App from './App'
import router from 'router'
import store from 'store'

import './plugins/lodash'
import './plugins/moment'
import './plugins/axios'
import './plugins/jquery'
import './plugins/bootstrap'
import './plugins/vue-resize'
import './components/index'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
