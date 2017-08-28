import Vue from 'vue'
import Router from 'vue-router'
// import iView from 'iview'
import NProgress from 'nprogress'

// import Login from '@/components/Login'
// import Home from '@/components/Home'

// import Sample from './routesMap/sample'
import Events from './routesMap/event'
import Control from './routesMap/control'

import NotFoundComponent from '@/components/notFoundComponent'
const sampleAutoExtract = resolve => require(['@/components/theme/sample/auto_extract'], resolve)
const sampleManualReview = resolve => require(['@/components/theme/sample/manual_review'], resolve)

const $utils = require('utils')

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    // {
    //   path: '/',
    //   redirect: { name: 'home' }
    // },
    // {
    //   path: '/login',
    //   name: 'login',
    //   component: Login
    // },
    // {
    //   path: '/home',
    //   name: 'home',
    //   component: Home
    // },
    // Sample,
    {
      path: '/sample/auto-extract',
      name: 'auto-extract',
      component: sampleAutoExtract
    },
    {
      path: '/sample/manual-review',
      name: 'manual-review',
      component: sampleManualReview
    },
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
  let isLogin = $utils.Cookie.get('realName')
  // console.log(isLogin)
  // function redirect () {
  //   let a = document.createElement('a')
  //   a.href = 'http://10.136.89.98/logout'
  //   a.click()
  // }
  if (!isLogin) {
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
