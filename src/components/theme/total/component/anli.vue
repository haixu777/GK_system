<template lang="html">
  <div class="anli">
    <Tag color="yellow" v-for="_event, index in content" :key="index">
      {{ _event.name }}
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
