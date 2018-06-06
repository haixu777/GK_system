<template lang="html">
  <div class="person">
    <Tag color="yellow" v-for="person, index in content" :key="index">
      {{ person.name }}
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
