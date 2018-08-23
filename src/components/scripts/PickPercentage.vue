<template lang="pug">
  .pick-percent
    h2 Record Pick Percentages
    .field
      label.label Competition
      .select
        select(v-model="activeComp" v-on:change="getMatches()")
          option Competition
          option(v-for="comp in competitions" v-bind:value="comp.id") {{ comp.name }}
    .field
      label.label Match
      .select
        select(v-model="activeMatch")
          option(value="") Match
          option(v-for="match in sortedMatches" v-bind:value="match") {{ match.homeTeamName }} vs {{ match.awayTeamName }}
    hr
    button.button.positive-button(v-bind:class="{'is-loading': isLoading}" v-on:click="savePickStats()") Calculate Percentages
    p {{ completedMessage }}
    p(v-if="isDone") Points assigning...
</template>

<script>
  import fireComp from '@/services/competition'
  import fireMatch from '@/services/match'
  import fireStats from '@/services/stats'
  import fireTeam from '@/services/team'
  import fireImage from '@/services/image'
  import firePicks from '@/services/pick'

  export default {
    name: 'pick-percent',
    data () {
      return {
        completedMessage: '',
        isLoading: false,
        isDone: false,
        activeComp: '',
        activeMatch: {},
        homeTeamInfo: {},
        awayTeamInfo: {},
        competitions: [],
        matches: [],
        picks: [],
        awayPicks: 0,
        homePicks: 0,
        homeSweep: 0,
        awaySweep: 0,
        homeTieBreaker: 0,
        awayTieBreaker: 0,
        homeThreeOne: 0,
        awayThreeOne: 0
      }
    },
    watch: {
      activeMatch: function () {
        if (this.activeMatch) {
          this.getTeamsInfo()
          this.getPicks()
        }
      }
    },
    methods: {
      getTeam: function (teamId, homeTeam) {
        var _this = this
        fireTeam.getTeamById(teamId).then(function (team) {
          fireImage.getTeamLogo(team.logo).then(function (logoUrl) {
            team.logoUrl = logoUrl
            if (homeTeam) _this.homeTeamInfo = team
            else _this.awayTeamInfo = team
          })
        })
      },
      getMatches: function () {
        console.log('Getting matches...')
        var _this = this
        if (this.activeComp) {
          fireMatch.getAllLeagueMatches(this.activeComp).then(function (matches) {
            _this.matches = matches
          })
        }
      },
      getPicks: function () {
        var _this = this
        _this.isLoading = true
        if (_this.activeMatch.id) {
          firePicks.getPicksForMatch(_this.activeMatch.id).then(function (picks) {
            _this.picks = picks
            console.log('done.')
            _this.isLoading = false
          })
        }
      },
      getTeamsInfo: function () {
        console.log('Getting the info for the teams.')
        if (this.activeMatch.homeTeamId) {
          this.getTeam(this.activeMatch.homeTeamId, true)
          this.getTeam(this.activeMatch.awayTeamId, false)
        } else console.error('No active match!')
      },
      savePickStats: function () {
        if (this.awayTeamInfo.color) {
          var _this = this
          var tmp = {}
          tmp.matchId = this.activeMatch.id
          tmp.awayColor = this.awayTeamInfo.color
          tmp.homeColor = this.homeTeamInfo.color
          tmp.homeTeamLogoUrl = this.homeTeamInfo.logoUrl
          tmp.awayTeamLogoUrl = this.awayTeamInfo.logoUrl
          tmp.homeShortName = this.homeTeamInfo.shortName
          tmp.homeName = this.homeTeamInfo.name
          tmp.awayShortName = this.awayTeamInfo.shortName
          tmp.awayName = this.awayTeamInfo.name
          tmp.homePercent = this.homeTeamPercent
          tmp.homePicks = this.homePicks
          tmp.awayPicks = this.awayPicks
          tmp.awayPercent = this.awayTeamPercent
          tmp.stage = this.activeMatch.stage
          tmp.week = this.activeMatch.week
          tmp.startDate = this.activeMatch.startDate
          tmp.totalCount = this.picks.length
          tmp.homeSweepPercent = this.homeSweepPercent
          tmp.awaySweepPercent = this.awaySweepPercent
          tmp.homeThreeOnePercent = this.homeThreeOnePercent
          tmp.awayThreeOnePercent = this.awayThreeOnePercent
          tmp.homeTieBreakerPercent = this.homeTieBreakerPercent
          tmp.awayTieBreakerPercent = this.awayTieBreakerPercent
          fireStats.saveMatchPickPercents(tmp).then(function (id) {
            _this.completedMessage = 'Saved ' + tmp.homeName + ' vs ' + tmp.awayName
          })
        }
      }
    },
    computed: {
      sortedMatches: function () {
        var sorted = this.matches.slice(0)
        return sorted.sort(function (a, b) { return (a.startDate < b.startDate) ? 1 : ((b.startDate < a.startDate) ? -1 : 0) })
      },
      homeThreeOnePercent: function () {
        return Math.round(this.homeThreeOne / this.picks.length * 100) || 0
      },
      awayThreeOnePercent: function () {
        return Math.round(this.awayThreeOne / this.picks.length * 100) || 0
      },
      homeSweepPercent: function () {
        return Math.round(this.homeSweep / this.picks.length * 100) || 0
      },
      awaySweepPercent: function () {
        return Math.round(this.awaySweep / this.picks.length * 100) || 0
      },
      homeTieBreakerPercent: function () {
        return Math.round(this.homeTieBreaker / this.picks.length * 100) || 0
      },
      awayTieBreakerPercent: function () {
        return Math.round(this.awayTieBreaker / this.picks.length * 100) || 0
      },
      homeTeamPercent: function () {
        var _this = this
        var total = this.picks.length
        var homeCount = 0
        var homePercent = 0
        var homeSweep = 0
        var awaySweep = 0
        var homeTieBreaker = 0
        var awayTieBreaker = 0
        var homeThreeOne = 0
        var awayThreeOne = 0

        if (total) {
          this.picks.forEach(function (pick) {
            if (pick.winner === _this.activeMatch.homeTeamId) {
              homeCount++
              if (pick.tieWinner !== 'none' && pick.tieWinner && pick.maps[0].winner) homeTieBreaker++
            } else {
              if (pick.tieWinner !== 'none' && pick.tieWinner && pick.maps[0].winner) awayTieBreaker++
            }
            if (pick.homeScore === '4') homeSweep++
            if (pick.awayScore === '4') awaySweep++
            if (pick.awayScore === '1' && pick.homeScore === '3') homeThreeOne++
            if (pick.awayScore === '3' && pick.homeScore === '1') awayThreeOne++
          })
          homePercent = homeCount / total * 100
          homePercent = Math.round(homePercent)
          _this.homePicks = homeCount
          _this.awayPicks = total - homeCount
          _this.homeThreeOne = homeThreeOne
          _this.awayThreeOne = awayThreeOne
          _this.homeTieBreaker = homeTieBreaker
          _this.awayTieBreaker = awayTieBreaker
          _this.homeSweep = homeSweep
          _this.awaySweep = awaySweep
          return homePercent
        } else return 0
      },
      awayTeamPercent: function () {
        return 100 - this.homeTeamPercent
      }
    },
    mounted: function () {
      var _this = this
      fireComp.getCompetitions().then(function (comps) {
        _this.competitions = comps
      })
    }
  }
</script>