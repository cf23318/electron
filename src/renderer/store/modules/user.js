import { pick } from 'lodash'
import { deepMerge } from '../../../main/utils/utils'
import {
  USER__SET_USER_INFO
} from '../types'

const state = {
  name: ''
}

const mutations = {
  /**
   * 设置信息
   */
  [USER__SET_USER_INFO] (state, userInfo) {
    userInfo = pick(userInfo, ['name'])
    deepMerge(state, userInfo)
  }
}

const actions = {
  [USER__SET_USER_INFO] ({ commit }, payload) {
    commit(USER__SET_USER_INFO, payload)
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
