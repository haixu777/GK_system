<template lang="html">
  <div class="taizhang">
    <div class="page" style="text-align:right;">
      <Page :current="currentPage" :total="total" :page-size="50" show-total @on-change="handlePageClick"></Page>
    </div>
    <Table border stripe size="small" :columns="columns" :data="content" ref="table"></Table>
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
          title: '内容',
          key: 'content'
        }
        // {
        //   title: '所属事件',
        //   key: 'name',
        //   width: 200,
        //   align: 'center'
        // }
      ]
    }
  },
  props: {
    content: {
      type: Array,
      default: function () {
        return [
          { name: 'test' }
        ]
      }
    },
    total: {
      type: Number
    }
  },
  methods: {
    handlePageClick (currentPage) {
      this.$emit('pageClick', 'taizhang', currentPage)
    }
  }
}
</script>

<style lang="css">
</style>
