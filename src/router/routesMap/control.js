const Control = resolve => require(['@/components/theme/control'], resolve)
const autoExtract = resolve => require(['@/components/theme/control/auto_extract'], resolve)
const dataEntry = resolve => require(['@/components/theme/control/data_entry'], resolve)
const manualReview = resolve => require(['@/components/theme/control/manual_review'], resolve)
const accountHandle = resolve => require(['@/components/theme/control/account_handle'], resolve)

export default {
  path: '/control',
  name: 'control',
  component: Control,
  children: [
    {
      path: 'auto_extract',
      name: 'auto_extract',
      component: autoExtract
    },
    {
      path: 'data_entry',
      name: 'data_entry',
      component: dataEntry
    },
    {
      path: 'manual_review',
      name: 'manual_review',
      component: manualReview
    },
    {
      path: 'account_handle',
      name: 'account_handle',
      component: accountHandle
    }
  ]
}
