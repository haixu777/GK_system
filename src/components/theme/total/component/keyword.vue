<template lang="html">
  <div class="website">
    <div class="keyword" style="text-align:right;">
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
          title: '关键词',
          width: 130,
          align: 'center',
          key: 'keyword'
        },
        {
          title: '所属事件',
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
      this.$emit('pageClick', 'keyword', currentPage)
    }
  }
}
</script>

<style lang="css">
</style>
