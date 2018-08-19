<template lang="html">
  <div class="control">
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
          title: '动作',
          width: 100,
          align: 'center',
          key: 'control_operation'
        },
        {
          title: '描述',
          key: 'control_descript'
        },
        {
          title: '所属事件',
          key: 'name',
          width: 200,
          align: 'center'
        },
        {
          title: '类型',
          key: 'sample_type',
          width: 100,
          align: 'center'
        },
        {
          title: '数量',
          key: 'control_number',
          width: 80,
          align: 'center'
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
    },
    loading: {
      type: Boolean,
      default: function () {
        return true
      }
    }
  },
  methods: {
    handlePageClick (currentPage) {
      this.$emit('pageClick', 'control', currentPage)
    }
  }
}
</script>

<style lang="css">
</style>
