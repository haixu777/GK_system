<template lang="html">
  <div class="">
    {{ groupList }}
  </div>
</template>

<script>
export default {
  data () {
    return {
      groupList: []
    }
  },
  props: ['eventId'],
  watch: {
    eventId (id) {
      this.fetchGroupByEventIdFromServer(id)
    }
  },
  methods: {
    fetchGroupByEventIdFromServer (id) {
      this.$axios.get('/events/fetchGroup', {
        params: {
          eventId: id
        }
      }).then((res) => {
        this.groupList = res.data.groupList
      }).catch((err) => {
        console.log(err)
      })
    }
  },
  mounted () {
    this.fetchGroupByEventIdFromServer(this.eventId)
  }
}
</script>

<style lang="css">
</style>
