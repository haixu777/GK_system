<template lang="html">
  <div class="">
    <Tag color="red" v-for="platform in platformList" :key="platform">
      {{ platform.name }}
    </Tag>
  </div>
</template>

<script>
export default {
  data () {
    return {
      platformList: []
    }
  },
  props: ['eventId'],
  watch: {
    eventId (id) {
      this.fetchPlateformByEventIdFromServer(id)
    }
  },
  methods: {
    fetchPlateformByEventIdFromServer (eventId) {
      this.$axios.get('/events/fetchPlatform', {
        params: {
          eventId: eventId
        }
      }).then((res) => {
        this.platformList = res.data.platformList
      }).catch((err) => {
        console.log(err)
      })
    }
  },
  mounted () {
    this.fetchPlateformByEventIdFromServer(this.eventId)
  }
}
</script>

<style lang="css">
</style>
