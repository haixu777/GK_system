<template lang="html">
  <div class="sample">
    <Table border size="small" :columns="columns" :data="content" ref="table"></Table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      columns: [
        {
          title: '标题',
          key: 'sample_title'
        },
        {
          title: '内容',
          key: 'sample_content'
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
        return []
      }
    }
  },
  methods: {
    exportData () {
      this.$refs.table.exportCsv({
        filename: 'sample'
      })
    }
  }
}
</script>

<style lang="css">
</style>
