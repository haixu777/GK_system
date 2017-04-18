const Sample = resolve => require(['@/components/theme/sample'], resolve)
const autoExtract = resolve => require(['@/components/theme/sample/auto_extract'], resolve)
const dataEntry = resolve => require(['@/components/theme/sample/data_entry'], resolve)
const manualReview = resolve => require(['@/components/theme/sample/manual_review'], resolve)

export default {
  path: '/sample',
  name: 'sample',
  component: Sample,
  children: [
    {
      path: 'auto-extract',
      name: 'auto-extract',
      component: autoExtract
    },
    {
      path: 'data-entry',
      name: 'data-entry',
      component: dataEntry
    },
    {
      path: 'manual-review',
      name: 'manual-review',
      component: manualReview
    }
  ]
}
