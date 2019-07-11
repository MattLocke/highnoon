<template lang="pug">
  .roster-history
    h2 Roster History By Week
    b-tabs(v-model="rosterHistoryTab" type="is-boxed")
      b-tab-item(v-for="week in weeks" :label="`${week}`" :key="week")
        .columns
          .column.is-one-third.is-offset-one-third
            h3 Roster For Week {{ week }}
            roster-history-week(:leagueId="league.id" :week="week")
</template>

<script>
import RosterHistoryWeek from '@/views/leagues/RosterHistoryWeek'

export default {
  name: 'RosterHistory',
  components: {
    RosterHistoryWeek
  },
  props: {
    league: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      rosterHistoryTab: 0
    }
  },
  computed: {
    config () {
      return this.$store.getters.getConfig
    },
    weeks () {
      const theWeeks = []
      for (let i = 1; i < this.config.currentWeek; i++) {
        theWeeks.push(i)
      }
      return theWeeks
    }
  }
}
</script>
