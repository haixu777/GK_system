<template lang="html">
  <div class="test">
    <i-button @click="noticeOpen">notice open</i-button>
    <i-button @click="noticeClose">notice close</i-button>
  </div>
</template>

<script>
export default {
  methods: {
    noticeOpen () {
      this.$Notice.error({
        title: 'error',
        desc: 'ansdnasld',
        key: 'test',
        duration: 0
      })
    },
    noticeClose () {
      this.$Notice.close('test')
    }
  }
}
</script>

<style lang="css">
</style>
