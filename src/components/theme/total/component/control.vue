<template lang="html">
  <div class="control">
    <Table border size="small" :columns="columns" :data="content" ref="table"></Table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      columns: [
        {
          title: '动作',
          key: 'control_operation'
        },
        {
          title: '数量',
          key: 'control_number'
        },
        {
          title: '类型',
          key: 'sample_type'
        },
        {
          title: '描述',
          key: 'control_descript'
        },
        {
          title: '所属事件',
          key: 'name'
        }
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
    loading: {
      type: Boolean,
      default: function () {
        return true
      }
    }
  }
}
</script>

<style lang="css">
</style>
