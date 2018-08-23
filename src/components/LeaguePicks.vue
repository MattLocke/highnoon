<template lang="pug">
  .league-picks
    section.section
      .container
        .box(v-if="match.isLocked || leagueId == 'Hrmm49l5fxx6hiipyXYz'")
          h1.text-border Match Picks 
            span.orange-text for 
            | {{ leagueData.name }}
          .spacer
          h3.overwatch-font {{ match.homeTeamName }}
            span.orange-text  vs 
            | {{ match.awayTeamName }}
          table.table.is-fullwidth.is-striped.owp-orange-border(v-if="matchPicks.length")
            thead
              tr
                th User
                th Points
                th 
                  span.is-hidden-touch Winner
                  span.is-hidden-desktop W
                th 
                  span.is-hidden-touch Home
                  span.is-hidden-desktop H
                th 
                  span.is-hidden-touch Away
                  span.is-hidden-desktop A
                th.is-hidden-touch(v-if="!leagueData.simpleMode") Map 1
                th.is-hidden-touch(v-if="!leagueData.simpleMode") Map 2
                th.is-hidden-touch(v-if="!leagueData.simpleMode") Map 3
                th.is-hidden-touch(v-if="!leagueData.simpleMode") Map 4
                th.is-hidden-touch(v-if="!leagueData.simpleMode") Tie
            tbody
              tr.actualMatchup(v-if="match")
                td ACTUAL MATCH
                td N/A
                td {{ matchWinner }}
                td {{ match.homeScore }}
                td {{ match.awayScore }}
                td.is-hidden-touch(v-if="!leagueData.simpleMode") {{ match.maps[0].winner }}
                td.is-hidden-touch(v-if="!leagueData.simpleMode") {{ match.maps[1].winner }}
                td.is-hidden-touch(v-if="!leagueData.simpleMode") {{ match.maps[2].winner }}
                td.is-hidden-touch(v-if="!leagueData.simpleMode") {{ match.maps[3].winner }}
                td.is-hidden-touch(v-if="!leagueData.simpleMode") {{ match.tieWinner }}
              tr(v-for="pick in matchPicks")
                td {{ displayName[pick.userId] }}
                td {{ pick.points }}
                td(v-bind:class="{'correct': pick.winnerShortName == matchWinner && match.matchWinner}") {{ pick.winnerShortName }}
                td(v-bind:class="{'correct': pick.homeScore == match.homeScore && match.matchWinner}") {{ pick.homeScore }}
                td(v-bind:class="{'correct': pick.awayScore == match.awayScore && match.matchWinner}") {{ pick.awayScore }}
                td.is-hidden-touch(v-if="!leagueData.simpleMode" v-bind:class="{'correct': pick.maps[0].winner === match.maps[0].winner}") {{ pick.maps[0].winner }}
                td.is-hidden-touch(v-if="!leagueData.simpleMode" v-bind:class="{'correct': pick.maps[1].winner === match.maps[1].winner}") {{ pick.maps[1].winner }}
                td.is-hidden-touch(v-if="!leagueData.simpleMode" v-bind:class="{'correct': pick.maps[2].winner === match.maps[2].winner}") {{ pick.maps[2].winner }}
                td.is-hidden-touch(v-if="!leagueData.simpleMode" v-bind:class="{'correct': pick.maps[3].winner === match.maps[3].winner}") {{ pick.maps[3].winner }}
                td.is-hidden-touch(v-if="!leagueData.simpleMode" v-bind:class="{'correct': pick.tieWinner === match.tieWinner}") {{ pick.tieWinner || 'n/a' }}
        .box(v-else)
          h2 Match Picks 
            span.orange-text for 
            | {{ leagueData.name }}
          p This match isn't locked yet, and that would be cheating!  Check back when it's locked!  (At match start time)
</template>

<script>
  import firePick from '@/services/pick'
  import fireLeague from '@/services/league'
  import fireMatch from '@/services/match'

  export default {
    name: 'league-picks',
    data () {
      return {
        leagueUsers: [],
        matchPicks: [],
        leagueData: {},
        match: {
          maps: [
            {winner: ''},
            {winner: ''},
            {winner: ''},
            {winner: ''}
          ]
        },
        leagueId: '',
        matchId: ''
      }
    },
    computed: {
      displayName: function () {
        if (this.leagueUsers.length) {
          return this.leagueUsers.reduce(function (map, obj) {
            map[obj.userId] = obj.userDisplayName
            return map
          }, {})
        } else return {}
      },
      matchWinner: function () {
        var tmp = 'N/A'
        if (this.match.matchWinner) {
          if (this.match.matchWinner === this.match.awayTeamId) tmp = this.match.awayTeamShortName
          else tmp = this.match.homeTeamShortName
        }
        return tmp
      }
    },
    methods: {
      getPicks: function () {
        var _this = this

        firePick.getPicksForLeague(this.leagueId, this.matchId).then(function (picks) {
          _this.matchPicks = picks
        })
      },
      getLeagueUsers: function () {
        var _this = this

        fireLeague.getLeagueUsers(_this.leagueId).then(function (data) {
          _this.leagueUsers = data
        })
      },
      getLeagueData: function () {
        var _this = this

        fireLeague.getLeagueById(_this.leagueId).then(function (data) {
          _this.leagueData = data.data
        })
      },
      getMatchData: function () {
        var _this = this

        fireMatch.getMatchById(_this.matchId).then(function (data) {
          _this.match = data
        })
      }
    },
    mounted: function () {
      this.leagueId = this.$route.params.leagueId
      this.matchId = this.$route.params.matchId

      this.getPicks()
      this.getLeagueUsers()
      this.getLeagueData()
      this.getMatchData()
    }
  }
</script>

<style lang="scss">
  @import '../variables.scss';
  .actualMatchup td {
    font-weight: bold;
  }
  td {
    color: $owp-dkgrey;
  }
  .correct {
    color: $owp-orange;
    font-weight: bold;
  }
</style>