<template lang="html">
  <div class="account">
    <Table border size="small" :columns="columns" :data="content" ref="table"></Table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      columns: [
        {
          title: '账号名',
          key: 'publish_account'
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
        filename: 'account'
      })
    }
  }
}
</script>

<style lang="css">
</style>
