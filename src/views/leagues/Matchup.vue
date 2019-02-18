<template lang="pug">
  section.matchup
    h2 Your Matchup
    .columns(v-if="myNextMatch")
      .column.is-half
        roster-listing(:left="myNextMatch.home" :right="myNextMatch.away")
      .column.is-half
        roster-listing(:left="myNextMatch.away" :right="myNextMatch.home" :isRight="true")
</template>

<script>
import { isEmpty } from 'lodash'
import RosterListing from '@/views/leagues/RosterListing'

export default {
  name: 'Matchup',
  components: {
    RosterListing
  },
  computed: {
    leagueId () {
      return this.$route.params.leagueId
    },
    userId () {
      return this.$store.getters.getUserId
    },
    config () {
      return this.$store.getters.getConfig
    },
    myNextMatch () {
      const actualWeek = this.config.currentWeek
      if (!isEmpty(this.schedule)) {
        if (this.schedule[actualWeek]) return this.schedule[actualWeek].find(matches => matches.away.userId === this.userId || matches.home.userId === this.userId)
      }
      return false
    },
    schedule () {
      return this.$store.getters.getLeagueSchedule
    }
  },
  mounted () {
    this.$store.dispatch('fetchLeagueSchedule', this.leagueId)
  }
}
</script>
