<template>
  <div id="app">
    <Menu mode="horizontal" :theme="'dark'" :active-name="activeName" @on-select="handleMenuSelect">
      <Menu-item name="sample">
        <Icon type="ios-paper"></Icon>
        取证样本
      </Menu-item>
      <Menu-item name="control">
        <Icon type="ios-people"></Icon>
        管控方案
      </Menu-item>
      <Menu-item name="event">
        <Icon type="settings"></Icon>
        事件分类
      </Menu-item>
    </Menu>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      activeName: this.$router.currentRoute.name
    }
  },
  methods: {
    handleMenuSelect (key) {
      this.activeName = key
      this.$router.push({
        name: this.activeName
      })
    }
  },
  mounted () {
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
