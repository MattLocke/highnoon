<template lang="pug">
  .stats
    h2 Stats
    .field
      label.label Competition
      select.select(v-model="activeComp" v-on:change="getMatches()")
        option Competition
        option(v-for="comp in competitions" v-bind:value="comp.id") {{ comp.name }}
    .field
      label.label Match
      select.select(v-model="activeMatch")
        option Match
        option(v-for="match in matches" v-bind:value="match") {{ match.homeTeamShortName }} vs {{ match.awayTeamShortName }}
    button.button.positive-button(v-bind:class="{'is-loading': isLoading}" v-on:click="getPickData()") Get pick stats
    .box
      table.table
        tr
          td {{ accuracy.homeTeamName }}
          td {{ accuracy.homeTeamPicks }}
          td {{ homeTeamPercent }}
        tr
          td {{ accuracy.awayTeamName }}
          td {{ accuracy.awayTeamPicks }}
          td {{ awayTeamPercent }}
        tr
          td Winner:
          td(colspan="2") {{ accuracy.winnerId }}
        

</template>

<script>
  // import fireLeague from '@/services/league'
  import fireMatch from '@/services/match'
  // import fireImage from '@/services/image'
  // import fireUser from '@/services/user'
  import firePick from '@/services/pick'
  import fireComp from '@/services/competition'
  // import fireTeam from '@/services/team'
  import logger from '@/services/logger'

  export default {
    name: 'stats',
    data () {
      return {
        teams: [],
        activeComp: '',
        matches: [],
        activeMatch: {},
        competitions: [],
        picks: [],
        accuracy: {},
        isLoading: false,
        compId: 'ALI8o0eJ30V1D1Fb7rHV'
      }
    },
    computed: {
      homeTeamPercent: function () {
        return Math.round(this.accuracy.homeTeamPicks / (this.accuracy.homeTeamPicks + this.accuracy.awayTeamPicks) * 100)
      },
      awayTeamPercent: function () {
        return Math.round(this.accuracy.awayTeamPicks / (this.accuracy.homeTeamPicks + this.accuracy.awayTeamPicks) * 100)
      }
    },
    methods: {
      getMatches: function () {
        console.log('Getting matches...')
        var _this = this
        fireMatch.getOldLeagueMatches(this.activeComp).then(function (matches) {
          _this.matches = matches
        })
      },
      accuracyReport: function () {
        var _this = this
        // get all the matches
        fireMatch.getOldLeagueMatches(this.compId).then(function (matches) {
          _this.matches = matches
          _this.getPickData()
        })
        // calculate stat
      },
      getPickData: function () {
        var _this = this
        var match = _this.activeMatch
        logger.logIt('Trying to get picks for match: ' + match.id)
        var stats = {
          'awayTeamName': match.awayTeamName,
          'awayTeamId': match.awayTeamId,
          'awayTeamPicks': 0,
          'homeTeamName': match.homeTeamName,
          'homeTeamId': match.homeTeamId,
          'homeTeamPicks': 0,
          'winnerId': match.matchWinner
        }
        // for each match, get all the picks that have that match id
        firePick.getPicksForMatch(match.id).then(function (picks) {
          logger.logIt('Found some picks!')
          _this.picks.push(picks)
          // go through each pick, and assign the winners to their own array.
          picks.forEach(function (pick) {
            logger.logIt('Getting pick details for pick...')
            if (pick.winner === stats.awayTeamId) stats.awayTeamPicks += 1
            else if (pick.winner === stats.homeTeamId) stats.homeTeamPicks += 1
          })
          _this.accuracy = stats
        })
      },
      testPicks: function () {
        firePick.getPicksForMatch('ijxSirYB4Mi6aGdFEKy6').then(function (picks) {
          console.table(picks)
        })
      }
    },
    mounted: function () {
      // this.accuracyReport()
      var _this = this
      fireComp.getCompetitions().then(function (comps) {
        _this.competitions = comps
      })
    }
  }
</script>