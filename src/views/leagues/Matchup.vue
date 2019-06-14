<template lang="pug">
  section.matchup
    h2 Your Matchup
    .columns(v-if="myNextMatch")
      .column.is-half
        roster-listing(v-if="fullRosterLeft" :fullRoster="leagueRoster" :team="myNextMatch.home" :right="myNextMatch.away")
      .column.is-half
        roster-listing(v-if="fullRosterRight" :fullRoster="leagueRoster" :team="myNextMatch.away" :right="myNextMatch.home" :isRight="true")
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
    fullRosterLeft () {
      return this.myNextMatch && !isEmpty(this.leagueRoster) ? this.leagueRoster[this.myNextMatch.home.userId] : {}
    },
    fullRosterRight () {
      return this.myNextMatch && !isEmpty(this.leagueRoster) ? this.leagueRoster[this.myNextMatch.away.userId] : {}
    },
    leagueRoster () {
      return this.$store.getters.getLeagueRoster
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
    this.$store.dispatch('getPlayerScores', this.config.currentWeek)
  }
}
</script>
