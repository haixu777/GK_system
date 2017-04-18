const Events = resolve => require(['@/components/theme/event'], resolve)
const Category = resolve => require(['@/components/theme/event/category'], resolve)
const Calendar = resolve => require(['@/components/theme/event/calendar'], resolve)

export default {
  path: '/event',
  name: 'event',
  component: Events,
  children: [
    {
      path: 'category',
      name: 'category',
      component: Category
    },
    {
      path: 'calendar',
      name: 'calendar',
      component: Calendar
    }
  ]
}
