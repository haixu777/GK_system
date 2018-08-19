<template lang="html">
  <div class="account">
    <div class="page" style="text-align:right;">
      <Page :current="currentPage" :total="total" :page-size="50" show-total @on-change="handlePageClick"></Page>
    </div>
    <Table stripe border size="small" :columns="columns" :data="content" ref="table"></Table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 70,
          align: 'center'
        },
        {
          title: '账号名',
          width: 130,
          align: 'center',
          key: 'publish_account'
        },
        {
          title: '平台',
          key: 'publish_platform'
        }
      ],
      currentPage: 1
    }
  },
  props: {
    content: {
      type: Array,
      default: function () {
        return []
      }
    },
    total: {
      type: Number
    }
  },
  methods: {
    exportData () {
      this.$refs.table.exportCsv({
        filename: 'account'
      })
    },
    handlePageClick (currentPage) {
      this.$emit('pageClick', 'account', currentPage)
    }
  }
}
</script>

<style lang="css">
</style>
