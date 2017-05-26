<template lang="html">
  <div class="control">
    <Menu mode="horizontal" :theme="'dark'" :active-name="activeName" @on-select="handleMenuSelect">
      <Menu-item name="home">
        <Icon type="ios-home"></Icon>
        首页
      </Menu-item>
      <!-- <Menu-item name="data_entry">
        <Icon type="ios-paper"></Icon>
        管控方案编辑
      </Menu-item> -->
      <Menu-item name="auto_extract">
        <Icon type="ios-people"></Icon>
        管控方案编辑
      </Menu-item>
      <Menu-item name="manual_review">
        <Icon type="settings"></Icon>
        管控方案审核
      </Menu-item>
    </Menu>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeName: this.$router.currentRoute.name
    }
  },
  methods: {
    handleMenuSelect (path) {
      if (path === 'home') {
        this.$router.push('/' + path)
      } else {
        this.$router.push('/control/' + path)
      }
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss">
</style>
