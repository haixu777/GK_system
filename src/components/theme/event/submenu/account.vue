<template lang="html">
  <div class="">
    <Tag color="yellow" v-for="account in accountList" :key="account">
      {{ account.publish_account }}
    </Tag>
  </div>
</template>

<script>
const $utils = require('utils')
export default {
  data () {
    return {
      accountList: []
    }
  },
  props: ['eventId'],
  watch: {
    eventId (id) {
      this.fetchAccountByEventIdFromServer(id)
    }
  },
  methods: {
    fetchAccountByEventIdFromServer (eventId) {
      this.$axios.get('/events/fetchAccount', {
        params: {
          eventId: eventId
        }
      }).then((res) => {
        this.accountList = $utils.formatAccountList(res.data.accountList)
      }).catch((err) => {
        console.log(err)
      })
    }
  },
  mounted () {
    this.fetchAccountByEventIdFromServer(this.eventId)
  }
}
</script>

<style lang="css">
</style>
