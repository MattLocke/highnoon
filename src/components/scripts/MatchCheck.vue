<template lang="pug">
  .bob
    section.section
      .container
        .box
          h2 Check for bad match points
          .field(v-if="compId")
            label.label Matchup
            .select
              select.select(v-model="activeMatch" v-on:change="getWinners()")
                option(v-for="matchup in sortedMatches" v-bind:value="matchup") {{ matchup.homeTeamName }} vs {{ matchup.awayTeamName }}
          table.table.is-fullwidth
            tr(v-for="pick in lowPointPicks")
              td {{ pick.id }}
              td {{ pick.points }}
              td {{ pick.winner }}

</template>

<script>
import fireMatch from '@/services/match'
import firePick from '@/services/pick'

export default {
  name: 'bob',
  data () {
    return {
      matches: [],
      compId: 'gleuqAnpFrtKZo2zpjmu',
      activeMatch: {},
      picks: []
    }
  },
  computed: {
    sortedMatches: function () {
      return this.matches.sort(function (a, b) { return (a.startDate < b.startDate) ? 1 : ((b.startDate < a.startDate) ? -1 : 0) })
    },
    lowPointPicks: function () {
      // var _this = this
      var tmp = []
      this.picks.forEach(function (pick) {
        if (pick.points >= 400 && pick.winner === 'VPd0gR7I0nAt9W0utmF2') tmp.push(pick)
      })
      return tmp
    }
  },
  methods: {
    getWinners: function () {
      var _this = this
      // get all picks for this match where winner is winner
      firePick.getPicksForMatch(_this.activeMatch.id).then(function (picks) {
        _this.picks = picks
      })
    }
  },
  mounted: function () {
    var _this = this
    fireMatch.getAllLeagueMatches(_this.compId).then(function (matches) {
      _this.matches = matches
    })
  }
}
</script>

<style lang="scss">
  @import '../../variables.scss';
</style>
