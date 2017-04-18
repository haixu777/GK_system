<template lang="html">
  <div class="sample">
    <Menu mode="horizontal" :theme="'dark'" :active-name="activeName" @on-select="handleMenuSelect">
      <Menu-item name="home">
        <Icon type="ios-home"></Icon>
        首页
      </Menu-item>
      <Menu-item name="data-entry">
        <Icon type="ios-paper"></Icon>
        数据录入
      </Menu-item>
      <Menu-item name="auto-extract">
        <Icon type="ios-people"></Icon>
        自动抽取
      </Menu-item>
      <Menu-item name="manual-review">
        <Icon type="settings"></Icon>
        人工校验
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
        this.$router.push('/sample/' + path)
      }
    }
  },
  mounted () {
  }
}
</script>

<style lang="css">
</style>
