import Vue from 'vue'
import Vuex from 'vuex'
import Store from 'electron-store'
import { createPersistedState, createSharedMutations } from 'vuex-electron'

import modules from './modules'

const vuexElectronStore = new Store({ name: 'vuex' })

Vue.use(Vuex)
Vue.prototype.$vuexElectronStore = vuexElectronStore

export default new Vuex.Store({
  modules,
  plugins: [
    createPersistedState({
      storage: vuexElectronStore
    }),
    createSharedMutations()
  ],
  strict: process.env.NODE_ENV !== 'production'
})
