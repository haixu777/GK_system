<template lang="html">
  <div class="tree">
    <el-tree
      :data="treeData"
      :props="defaultProps"
      style="min-width: 120px;"
      :highlight-current="true">
    </el-tree>
  </div>
</template>

<script>
export default {
  data () {
    return {
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  methods: {
    fetchEventsTree () {
      this.$axios.get('/events/getTree')
        .then((res) => {
          this.treeData = res.data.tree
        }).catch((err) => {
          console.log(err)
        })
    }
  },
  mounted () {
    this.fetchEventsTree()
  }
}
</script>

<style lang="css">
</style>
