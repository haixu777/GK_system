import Vue from 'vue'
import Router from 'vue-router'
import Sample from '@/components/Sample'
import Control from '@/components/Control'
import Events from '@/components/Event'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: { name: 'sample' }
    },
    {
      path: '/sample',
      name: 'sample',
      component: Sample
    },
    {
      path: '/control',
      name: 'control',
      component: Control
    },
    {
      path: '/event',
      name: 'event',
      component: Events
    }
  ]
})
