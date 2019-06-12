<template lang="pug">
  .roster-history-week
    roster-listing(:fullRoster="fullRoster" :team="roster" :referenceScores="scores" v-if="fullRoster")
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
      fullRoster: {},
      roster: {},
      scores: {}
    }
  },
  computed: {
    userId () {
      return this.$store.getters.getUserId
    }
  },
  watch: {
    leagueId: {
      immediate: true,
      handler (val) {
        if (val) {
          RosterService.getRosterByWeek(this.leagueId, this.week, this.userId)
            .then((roster) => {
              this.roster = { ...roster, userId: this.userId }
            })
            .then(() => RosterService.getRosterScores(this.week))
            .then((scores) => {
              this.scores = scores
            })
            .then(() => RosterService.getUnlimitedRosterTotals(this.leagueId, this.week))
            .then((fullRoster) => {
              this.fullRoster = fullRoster
            })
            .catch(e => console.error(e))
        }
      }
    }
  }
}
</script>
