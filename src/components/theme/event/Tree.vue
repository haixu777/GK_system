<template lang="html">
  <div class="tree" style="text-align: left;">
  </div>
</template>

<script>
export default {
  props: {
    data: {
      required: true,
      type: Array
    },
    defaultProps: {
      type: Object
    },
    filterText: {
      type: String
    },
    filterNode: {
      type: Array
    }
  },
  data () {
    return {
    }
  },
  watch: {
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
    // this.fetchEventsTree()
  }
}
</script>

<style lang="css">
</style>
