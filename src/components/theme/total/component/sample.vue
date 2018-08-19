<template lang="html">
  <div class="sample">
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
          title: '类型',
          key: 'sample_format',
          width: 100
          // align: ''
        },
        {
          title: '标题',
          width: 300,
          key: 'sample_title'
        },
        {
          title: '内容',
          key: 'sample_content'
        },
        {
          title: '所属事件',
          width: 200,
          key: 'name'
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
        filename: 'sample'
      })
    },
    handlePageClick (currentPage) {
      this.$emit('pageClick', 'sample', currentPage)
    }
  }
}
</script>

<style lang="css">
</style>
