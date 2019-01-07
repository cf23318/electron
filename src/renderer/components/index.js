import Vue from 'vue'

import Poster from './Poster.vue'

let components = {
  Poster
}

Object.keys(components).forEach((key) => {
  Vue.component(key, components[key])
})
