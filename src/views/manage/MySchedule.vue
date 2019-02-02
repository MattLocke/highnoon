<template lang="pug">
  .my-schedule
    .matchup.left-bar-item(v-if="myNextMatch")
      .columns.is-mobile
        .column
          span {{ myNextMatch.home.displayName }}
        .column.is-narrow
          span vs
        .column
          span.is-pulled-right {{ myNextMatch.away.displayName }}
    p(v-else) No upcoming matches!
</template>

<script>
import { isEmpty } from 'lodash'

export default {
  name: 'MySchedule',
  props: {
    leagueId: {
      type: String,
      required: true
    }
  },
  computed: {
    config () {
      return this.$store.getters.getConfig
    },
    myNextMatch () {
      const actualWeek = this.config.currentWeek + 1
      if (!isEmpty(this.schedule)) {
        return this.schedule[actualWeek].find(matches => matches.away.userId === this.userData.id || matches.home.userId === this.userData.id)
      }
      return false
    },
    schedule () {
      return this.$store.getters.getLeagueSchedule
    },
    userData () {
      return this.$store.getters.getUserData
    }
  },
  watch: {
    leagueId: {
      immediate: true,
      handler (val) {
        if (!isEmpty(val)) {
          this.$store.dispatch('fetchLeagueSchedule', val)
        }
      }
    }
  }
}
</script>
