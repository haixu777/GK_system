<template lang="html">
  <div class="taizhang">
    <Table border size="small" :columns="columns" :data="content" ref="table"></Table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      columns: [
        {
          title: '内容',
          key: 'content'
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
