<template lang="pug">
  .leave-league
    h2 Leave League
    p Leaving this league will remove your picks and all points gained from this league!
    button.button.positive-button(v-if="isSure" v-on:click="leaveLeague()") Click To Confirm!
    button.button.negative-button(v-else v-on:click="seeIfSure()") Leave League
</template>

<script>
  import fireLeague from '@/services/league'

  export default {
    props: [
      'leagueId', 'userId'
    ],
    components: {
      'confirm': confirm
    },
    data () {
      return {
        isSure: false
      }
    },
    methods: {
      seeIfSure: function () {
        this.isSure = true
      },
      leaveLeague: function () {
        var isLeaver = true
        fireLeague.leaveLeague(this.leagueId, this.userId, isLeaver, this.$router)
      }
    }
  }
</script>