<template lang="html">
  <div class="">
    {{ keywordsList }}
  </div>
</template>

<script>
export default {
  data () {
    return {
      keywordsList: []
    }
  },
  props: ['eventId'],
  watch: {
    eventId (id) {
      this.fetchKeywordByEventIdFromServer(id)
    }
  },
  methods: {
    fetchKeywordByEventIdFromServer (eventId) {
      this.$axios.get('/events/fetchKeywords', {
        params: {
          eventId: eventId
        }
      }).then((res) => {
        this.keywordsList = res.data.keywordsList
      }).catch((err) => {
        console.log(err)
      })
    }
  },
  mounted () {
    this.fetchKeywordByEventIdFromServer(this.eventId)
  }
}
</script>

<style lang="css">
</style>
