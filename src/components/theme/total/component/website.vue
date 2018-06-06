<template lang="html">
  <div class="website">
    <Table border size="small" :columns="columns" :data="content" ref="table"></Table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      columns: [
        {
          title: '网站名称',
          key: 'publish_platform'
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
    }
  }
}
</script>

<style lang="css">
</style>
