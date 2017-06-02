<template lang="html">
  <div class="person_container">
    <Card style="width:300px;display:inline-block;margin:5px;" v-for="person in personList" :key="person">
      <p slot="title" style="color:#f90;">
        <Icon type="ios-person"></Icon>
        {{ person.name }}
      </p>
      <p><b>性别</b>: {{ person.gender }}</p>
      <p><b>出生</b>: {{ person.birthdate }}</p>
      <p><b>籍贯</b>: {{ person.nativeplace }}</p>
      <p><b>住址</b>: {{ person.residence }}</p>
      <!-- <p><b>职业</b>: {{ person.occupation }}</p> -->
      <!-- <p><b>关注</b>: {{ person.attention }}</p> -->
      <!-- <p><b>倾向</b>: {{ person.tendency }}</p> -->
      <!-- <p><b>影响</b>: {{ person.influence }}</p> -->
      <!-- <p><b>信仰</b>: {{ person.faith }}</p> -->
      <!-- <p><b>教育</b>: {{ person.education }}</p> -->
      <!-- <p><b>评论</b>: {{ person.comment }}</p> -->
    </Card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      personList: []
    }
  },
  props: ['eventId'],
  watch: {
    eventId (id) {
      this.fetchPersonByEventIdFromServer(id)
    }
  },
  methods: {
    fetchPersonByEventIdFromServer (eventId) {
      this.$axios.get('/events/fetchPersons', {
        params: {
          eventId: eventId
        }
      }).then((res) => {
        this.personList = res.data.personList
      }).catch((err) => {
        console.log(err)
      })
    }
  },
  mounted () {
    this.fetchPersonByEventIdFromServer(this.eventId)
  }
}
</script>

<style lang="scss">
  .person_container {
  }
</style>
