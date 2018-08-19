import Vue from 'vue'
import Router from 'vue-router'
// import iView from 'iview'
import NProgress from 'nprogress'

// import Login from '@/components/Login'
import Home from '@/components/Home'

import Sample from './routesMap/sample'
import Events from './routesMap/event'
import Control from './routesMap/control'
import Total from './routesMap/total'

import NotFoundComponent from '@/components/notFoundComponent'

const $utils = require('utils')

const isDev = process.env.NODE_ENV === 'development'

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
    Total,
    {
      path: '*',
      component: NotFoundComponent
    }
  ]
})

function redirect () {
  let a = document.createElement('a')
  a.href = 'http://10.136.89.74/logout'
  a.click()
}

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (isDev) { // 开发模式，无需验证ticket
    return next()
  } else { // 部署模式
    let ticket = $utils.Cookie.get('ticket')
    // 判断是否有ticket
    if (ticket) {
      return next()
    } else {
      return redirect()
    }
  }
})

router.afterEach((to, from, next) => {
  NProgress.done()
  // iView.LoadingBar.finish()
})

module.exports = router
