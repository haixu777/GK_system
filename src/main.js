// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Axios from 'axios'
import fullCalendar from 'vue-fullcalendar'
import jsPlumb from 'jsplumb'

Axios.defaults.baseURL = 'http://localhost:3000'
Vue.prototype.$axios = Axios

import { Tree, Button, Cascader, Table, TableColumn, Pagination } from 'element-ui'
Vue.use(Tree)
Vue.use(Button)
Vue.use(Cascader)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(jsPlumb)
Vue.use(Pagination)

import iView from 'iview'
import 'iview/dist/styles/iview.css'
Vue.use(iView)

Vue.component('full-calendar', fullCalendar)

Vue.config.productionTip = false

iView.LoadingBar.config({
  color: '#00cc66',
  height: 4
})
Axios.interceptors.request.use((response) => {
  iView.LoadingBar.finish()
  return response
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  }
})
