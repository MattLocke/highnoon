<template lang="pug">
  .league-matchups
    router-link.button.is-primary.is-pulled-right(:to="`/leagueStandard/${leagueId}`") Back To League
    h1 {{ league.leagueName }} -
      span.orange  Week {{ week }}
    hr
    .columns.is-multiline
      .column.is-one-quarter-desktop.is-one-third-tablet(v-for="matchup in matchups")
        section
          .columns
            .column.is-half
              roster-listing(:left="matchup.home" :raw="league.rawScoring" :referenceScores="scores")
            .column.is-half
              roster-listing(:left="matchup.away" :isRight="true" :raw="league.rawScoring" :referenceScores="scores")
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
      league: {},
      schedule: [],
      scores: []
    }
  },
  computed: {
    leagueId () {
      return this.$route.params.leagueId
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
          this.getLeague(val).then(() => {
            this.$store.dispatch('fetchRoster', { leagueId: this.leagueId, leagueType: this.league.leagueType })
            RosterService.getRosterScores(this.week, this.league.rawScoring)
              .then((scores) => {
                this.scores = scores
              })
          })
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
    }
  }
}
</script>
