<template lang="pug">
  .league-pickem
    .columns
      left-bar
      .column
        section
          h1 League overview for Pick'em - Yep.
        section(v-for="match in currentWeeksMatches")
          .columns
            .column
              span.is-pulled-right {{ match.competitors[0].name }}
            .column.is-narrow
              img(:src="`images/teams/${match.competitors[0].abbreviatedName}.svg`" width="22" height="22")
            .column.is-narrow
              b-checkbox
            .column.is-narrow
              span vs
            .column.is-narrow
              b-checkbox
            .column.is-narrow
              img(:src="`images/teams/${match.competitors[1].abbreviatedName}.svg`" width="22" height="22")
            .column
              span {{ match.competitors[1].name }}
</template>

<script>
import { get } from 'lodash'

import LeagueService from '@/services/league'

export default {
  name: 'LeaguePickem',
  data () {
    return {
      league: {
        message: '',
        image: ''
      }
    }
  },
  computed: {
    config () {
      return this.$store.getters.getConfig
    },
    currentWeeksTimes () {
      const currentWeekIndex = this.config.currentWeek === 0 ? 0 : this.config.currentWeek - 1
      const currentStage = this.config.currentStage || 1
      const weekTimes = get(this.config, `stage${currentStage}times`, [])
      return weekTimes[currentWeekIndex]
    },
    currentWeeksMatches () {
      if (this.currentWeeksTimes) return this.matches.filter(match => match.startDateTS >= this.currentWeeksTimes.starts && match.endDateTS <= this.currentWeeksTimes.ends)
      return []
    },
    isOwner () {
      return this.userId === this.league.ownerId
    },
    leagueId () {
      return this.$route.params.leagueId
    },
    matches () {
      return this.$store.getters.getMatches
    },
    userId () {
      return this.$store.getters.getUserId
    }
  },
  watch: {
    leagueId: {
      immediate: true,
      handler (val) {
        if (val) {
          this.$store.dispatch('fetchLeagueUsers', { leagueId: this.leagueId, leagueType: 'pickem' })
          this.getLeague(val)
        }
      }
    }
  },
  mounted () {
    this.$store.dispatch('fetchMatches')
  },
  methods: {
    getLeague (leagueId) {
      this.$store.dispatch('setLoading', true)
      LeagueService.getLeague(leagueId, 'pickem')
        .then((league) => {
          this.league = { ...this.league, ...league }
        })
        .then(() => {
          this.$store.dispatch('setLoading', false)
          this.listenForDraft()
        })
        .catch(() => {
          this.$store.dispatch('setLoading', false)
          this.$toast.open({
            message: 'Failure to find that link',
            type: 'is-danger',
            position: 'is-bottom'
          })
        })
    }
  }
}
</script>
