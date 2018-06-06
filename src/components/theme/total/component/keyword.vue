<template lang="html">
  <div class="keyword">
    <Tag color="yellow" v-for="keyword, index in content" :key="index">
      {{ keyword.keyword }}
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
