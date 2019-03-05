<template lang="pug">
  .roster-history-week
    roster-listing(:left="roster" :referenceScores="scores")
</template>

<script>
import RosterService from '@/services/roster'

import RosterListing from '@/views/leagues/RosterListing'

export default {
  name: 'RosterHistoryWeek',
  components: {
    RosterListing
  },
  props: {
    leagueId: {
      type: String,
      required: true
    },
    week: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      roster: {},
      scores: {}
    }
  },
  computed: {
    userId () {
      return this.$store.getters.getUserId
    },
    weekScores () {
      return this.$store.getters.getPlayerScores
    }
  },
  watch: {
    leagueId: {
      immediate: true,
      handler (val) {
        if (val) {
          this.$store.dispatch('getPlayerScores', this.week)
          RosterService.getRosterByWeek(this.leagueId, this.week, this.userId)
            .then((roster) => {
              this.roster = roster
            })
          RosterService.getRosterScores(this.week)
            .then((scores) => {
              this.scores = scores
            })
        }
      }
    }
  }
}
</script>
