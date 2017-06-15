import Vue from 'vue'
import Router from 'vue-router'
// import iView from 'iview'
import NProgress from 'nprogress'

import Login from '@/components/Login'
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
      redirect: { name: 'login' }
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
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
  // iView.LoadingBar.start()
  NProgress.start()
  let isLogin = $utils.Cookie.get('login')
  if (!isLogin) {
    if (to.path !== '/login') {
      return next({path: '/login'})
    } else {
      next()
    }
  } else {
    // if (to.path === '/login') {
    //   // return next({path: '/login'})
    //
    // }
    next()
  }
})

router.afterEach((to, from, next) => {
  NProgress.done()
  // iView.LoadingBar.finish()
})

module.exports = router
