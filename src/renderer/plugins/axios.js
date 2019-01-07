import Vue from 'vue'
import axios from 'axios'
import router from 'router'
// import store from '@/store'
import { isObject } from 'lodash'
// import { USER__DELETE_ALL_INFO } from 'const'

// axios.defaults.baseURL = 'http://promo.tripday.com.au/';
axios.defaults.timeout = 60000
axios.defaults.headers.post = {}
axios.defaults.headers.common.Accept = 'application/json, text/plain, */*'

axios.interceptors.request.use(function (config) {
  // 如果是登入状态，那么传递token
  // if (store.getters.isLogin) {
  //   const userInfo = store.state.user.info

  //   config.headers.Authorization = `token ${userInfo.token}`

  //   if (config.method === 'post' && /application\/json/.test(config.headers.common.Accept)) {
  //     // 在post请求种添加 token
  //     config.data = Object.deepMerge({}, config.data, {
  //       token: userInfo.token
  //     })
  //   }
  // }

  return config
}, function (err) {
  return Promise.reject(err)
})

axios.interceptors.response.use(function (response) {
  const data = response.data

  if (data) {
    switch (data.status) {
      case 200:
        break
      case 400:
        Vue.prototype.$message({
          type: 'error',
          text: data.msg || '请求出现错误!'
        })
        break
      case 401: // 用户登入过期或未登入
        // 删除token
        // store.commit(USER__DELETE_ALL_INFO)

        Vue.prototype.$confirm('内容需登入查看，是否前往登入页!', '警告', {
          confirmButtonText: '前往',
          cancelButtonText: '返回首页',
          type: 'error'
        }).then(() => {
          router.replace({
            path: '/user/singin',
            query: { redirect: router.app._route.fullPath }
          })
        }).catch(() => {
          router.replace({
            path: '/'
          })
        })
        break
      default:
        showWarn('数据格式错误!')
    }
  } else {
    showWarn('返回数据为空!')
  }

  return data
}, function (error) {
  if (axios.isCancel(error)) {
    // 再次打印取消的ajax请求信息
    // console.warn('取消请求', error);
  } else {
    Vue.prototype.$message({
      type: 'error',
      text: error.response && error.response.data && (error.response.data.msg || error.message)
    })
  }

  return Promise.reject(error)
})

function showWarn (text) {
  Vue.prototype.$message({
    type: 'error',
    text: text
  })
}

// 取消ajax请求，并刷新全局token
let source = null
function cancelAjax (text) {
  if (source) source.cancel(text)
  source = axios.CancelToken.source()
}

// 更改原生axios post，当options.cancelToken === true时，会在改变router时，自动取消ajax
let axiosPost = axios.post
axios.post = function (...args) {
  // args[2] 为options
  if (isObject(args[2]) && args[2].cancelToken === true) {
    args[2].cancelToken = source.token
  }

  return axiosPost(...args)
}

Vue.prototype.$ajax = axios
export default { $ajax: axios, $cancel: cancelAjax }
