import {
  SETTING__SET_ASIDE_NAV,
  SETTING__SET_NETWORK_STATUS
} from '../types'

const state = {
  asideNav: [],
  networkStatus: true
}

const mutations = {
  /**
   * 设置asideNav导航内容
   */
  [SETTING__SET_ASIDE_NAV] (state, { asideNav }) {
    asideNav[0].selection = true
    state.asideNav = asideNav
  },
  /**
   * 设置网络状态
   */
  [SETTING__SET_NETWORK_STATUS] (state, { networkStatus }) {
    console.log('networkStatus', networkStatus)
    state.networkStatus = networkStatus
  }
}

const actions = {
  [SETTING__SET_ASIDE_NAV] ({ commit }, payload) {
    commit(SETTING__SET_ASIDE_NAV, payload)
  },
  [SETTING__SET_NETWORK_STATUS] ({ commit }, payload) {
    commit(SETTING__SET_NETWORK_STATUS, payload)
  }
}

const getters = {

}

export default {
  state,
  mutations,
  actions,
  getters
}
