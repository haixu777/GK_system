<template>
  <div id="app">
    <!-- <router-view></router-view> -->
    <home></home>
  </div>
</template>

<script>
import Home from '@/components/Home'
export default {
  name: 'app',
  components: {
    Home
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
  /*background: url('./assets/bg.jpg');*/
}
.ivu-menu-dark {
  background: #464c5b !important;
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
