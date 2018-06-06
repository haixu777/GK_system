<template lang="html">
  <div class="group">
    <Tag color="yellow" v-for="item, index in content" :key="index">
      {{ item.name }}
    </Tag>
  </div>
</template>

<script>
export default {
  data () {
    return {
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
