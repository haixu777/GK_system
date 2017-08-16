import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
    logout () {
      axios.post('/logout')
        .then((res) => {
          console.log(res)
        })
    }
  }
})
