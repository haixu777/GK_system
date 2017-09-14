import Vue from 'vue'
import Vuex from 'vuex'
const $utils = require('utils')

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userName: unescape($utils.Cookie.get('userName'))
  },
  mutations: {
    logout () {
      $utils.Cookie.del('realName')
      let a = document.createElement('a')
      a.href = 'http://10.136.89.74/logout'
      a.click()
    }
  }
})
