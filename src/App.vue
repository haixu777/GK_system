<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {
  },
  data () {
    return {
    }
  },
  methods: {
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
  height: 100%;
  font-size: 16px;
  /*background: url('./assets/bg.jpg');*/
}
.ivu-menu-dark {
  background: #464c5b !important;
}
.ivu-menu-item {
  font-size: 18px !important;
}
.clearfix {
  overflow:auto;
  _height:1%
}
* {
  -box-sizing: inherit !important;
}
.condition_container {
  padding: 5px;
  text-align: left;
}
</style>
