<template lang="pug">
  .league-matchups
    div(v-if="liveConfig.canSeeMatchups")
      router-link.button.is-primary.is-pulled-right(:to="`/leagueStandard/${leagueId}`") Back To League
      h1 {{ league.leagueName }} -
        span.orange  Week {{ week }}
      p Colored scores are the ones being used in your league!
      hr
      .columns.is-multiline
        .column.is-one-quarter-desktop.is-one-third-tablet(v-for="matchup in matchups")
          section
            .columns
              .column.is-half
                roster-listing(v-if="fullRoster" :fullRoster="fullRoster" :team="matchup.home" :raw="league.rawScoring" :referenceScores="scores")
              .column.is-half
                roster-listing(v-if="fullRoster" :fullRoster="fullRoster" :team="matchup.away" :isRight="true" :raw="league.rawScoring" :referenceScores="scores")
    .container(v-else)
      section.section
        h1 Matchups
        p This section is currently down for maintenance
        router-link.button.is-primary(:to="`/leagueStandard/${leagueId}`") Back To League
</template>

<script>
import LeagueService from '@/services/league'
import RosterService from '@/services/roster'

import RosterListing from '@/views/leagues/RosterListing'

export default {
  name: 'LeagueMatchup',
  components: {
    RosterListing
  },
  data () {
    return {
      fullRoster: {},
      league: {},
      schedule: [],
      scores: {}
    }
  },
  computed: {
    config () {
      return this.$store.getters.getConfig
    },
    leagueId () {
      return this.$route.params.leagueId
    },
    liveConfig () {
      return this.$store.getters.getLiveConfig
    },
    matchups () {
      return this.schedule[this.week] || []
    },
    week () {
      return this.$route.params.week
    }
  },
  watch: {
    leagueId: {
      immediate: true,
      handler (val) {
        if (val) {
          this.getSchedule(val)
          this.getLeague(val)
        }
      }
    }
  },
  methods: {
    getLeague (leagueId) {
      this.$store.dispatch('setLoading', true)
      return LeagueService.getLeague(leagueId)
        .then((league) => {
          this.league = { ...this.league, ...league }
        })
        .then(() => RosterService.getRosterTotals(this.leagueId, this.week, this.config.currentWeek))
        .then((rosterMap) => {
          this.fullRoster = rosterMap
        })
        .then(() => RosterService.getRosterScores(this.week, this.league.rawScoring))
        .then((scores) => {
          this.scores = scores
        })
        .catch((e) => {
          this.$toast.open({
            message: `Failure to get league ${leagueId}: ${e}`,
            type: 'is-danger',
            position: 'is-bottom'
          })
        })
        .finally(() => {
          this.$store.dispatch('setLoading', false)
        })
    },
    getSchedule (leagueId) {
      this.$store.dispatch('setLoading', true)
      LeagueService.getSchedule(leagueId)
        .then((schedule) => {
          this.schedule = schedule
          this.$store.dispatch('setLoading', false)
        })
        .catch((e) => {
          this.$toast.open({
            message: `Failure to get schedule: ${e}`,
            type: 'is-danger',
            position: 'is-bottom'
          })
        })
        .finally(() => {
          this.$store.dispatch('setLoading', false)
        })
    }
  }
}
</script>
