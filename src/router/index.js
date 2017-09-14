import Vue from 'vue'
import Router from 'vue-router'
// import iView from 'iview'
import NProgress from 'nprogress'

// import Login from '@/components/Login'
import Home from '@/components/Home'

import Sample from './routesMap/sample'
import Events from './routesMap/event'
import Control from './routesMap/control'

import NotFoundComponent from '@/components/notFoundComponent'

const $utils = require('utils')

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: { name: 'home' }
    },
    // {
    //   path: '/login',
    //   name: 'login',
    //   component: Login
    // },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    Sample,
    Control,
    Events,
    {
      path: '*',
      component: NotFoundComponent
    }
  ]
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  let ticket = $utils.Cookie.get('ticket')
  // console.log(ticket)
  // function redirect () {
  //   let a = document.createElement('a')
  //   a.href = 'http://10.136.89.98/logout'
  //   a.click()
  // }
  if (!ticket) {
    return next()
  } else {
    return next()
  }
})

router.afterEach((to, from, next) => {
  NProgress.done()
  // iView.LoadingBar.finish()
})

module.exports = router
