import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'

// import Login from '@/components/Login'
// import index from '@/components/theme/event/wxb_index'
import Calendar from '@/components/theme/event/calendar'
import MyTags from '@/components/theme/event/myTags'

import NotFoundComponent from '@/components/notFoundComponent'

// const $utils = require('utils')

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/calendar'
    },
    {
      path: '/calendar',
      component: Calendar
    },
    {
      path: '/mytags',
      name: 'mytag',
      component: MyTags
    },
    {
      path: '*',
      component: NotFoundComponent
    }
  ]
})

router.beforeEach((to, from, next) => {
  // iView.LoadingBar.start()
  NProgress.start()
  next()
  /*
  let ticket = $utils.Cookie.get('ticket')
  console.log(ticket)
  function redirect () {
    let a = document.createElement('a')
    a.href = 'http://10.136.89.98/logout'
    a.click()
  }
  if (!ticket) {
    return next()
  } else {
    return next()
  }
  */

  // next()
  /*
  if (!isLogin) {
    if (to.path !== '/login') {
      return next({path: 'http://10.136.89.98/'})
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
  */
})

router.afterEach((to, from, next) => {
  NProgress.done()
  // iView.LoadingBar.finish()
})

module.exports = router
