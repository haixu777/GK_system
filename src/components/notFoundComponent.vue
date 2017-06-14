<template lang="html">
  <div class="pageNotFound">
    <img :src="require('assets/404.png')" alt="404">
  </div>
</template>

<script>
export default {
  methods: {
  }
}
</script>

<style lang="scss">
  .pageNotFound {
    width: 100%;
    height: 990px;
    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
