// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Axios from 'axios'

Axios.defaults.baseURL = 'http://localhost:3000'
Vue.prototype.$axios = Axios

import { Tree, Button } from 'element-ui'
Vue.use(Tree)
Vue.use(Button)

import iView from 'iview'
import 'iview/dist/styles/iview.css'
Vue.use(iView)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  }
})
