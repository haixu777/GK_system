<template lang="html">
  <div class="procedure_container">
    <img v-if="showImg" :src="require('assets/zhongmu.png')" alt="procedure">
  </div>
</template>

<script>
export default {
  data () {
    return {
      showImg: null
    }
  },
  props: ['eventId'],
  watch: {
  },
  mounted () {
    this.showImg = this.eventId === 207
  }
}
</script>

<style lang="scss">
  .procedure_container {
    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
