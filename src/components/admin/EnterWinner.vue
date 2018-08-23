<template lang="pug">
  .enter-winner
    h2 Event Winner
    .box
      .field
        label.label Competition
        .select
          select(v-model="activeComp" v-on:change="getMatchups()")
            option Competition
            option(v-for="comp in competitions" v-bind:value="comp.id") {{ comp.name }}
      .field(v-if="activeComp")
        label.label Matchup
        .select
          select.select(v-model="activeMatch" v-on:change="getMatch()")
            option(v-for="matchup in validMatches" v-bind:value="matchup.id") {{ matchup.homeTeamName }} vs {{ matchup.awayTeamName }}
      .field
        p MatchId: {{ activeMatch }}
      .field(v-if="activeMatch")
        label.label Winner
        .select
          select.select(v-model="match.matchWinner")
            option(v-bind:value="match.homeTeamId") {{ match.homeTeamName }}
            option(v-bind:value="match.awayTeamId") {{ match.awayTeamName }}
      .field(v-if="match.matchWinner")
        .columns
          .column
            label.label {{ match.homeTeamName }}
            .select
              select.is-large(v-model="match.homeScore")
                option 0
                option 1
                option 2
                option 3
                option 4
                option 5
                option 6
                option 7
          .column
            label.label {{ match.awayTeamName }}
            .select
              select.is-large(v-model="match.awayScore")
                option 0
                option 1
                option 2
                option 3
                option 4
                option 5
                option 6
                option 7
      .mapsection(v-if="match.matchWinner")
        .maps
          .columns.is-desktop
            .column(v-for="(map, index) in match.maps")
              h4.overwatch-font.text-border {{ map.type }}
              .match-option
                .select
                  select.is-large(v-model="match.maps[index].winner")
                    option {{ match.homeTeamName }}
                    option {{ match.awayTeamName }}
                    option(v-if="index !== 2") Draw
            .column
              h4.overwatch-font.text-border Tie Winner
              .match-option
                .select
                  select.is-large(v-model="match.tieWinner")
                    option {{ match.homeTeamName }}
                    option {{ match.awayTeamName }}
                    option none
    .box(v-if="match.maps[0].winner")
      button.button.positive-button(v-on:click="setWinner()") Save Match
</template>

<script>
  import fireMatch from '@/services/match'
  import fireTeam from '@/services/team'
  import fireComp from '@/services/competition'

  export default {
    name: 'enter-winner',
    data () {
      return {
        teams: [],
        competitions: [],
        oldMatches: [],
        activeMatch: '',
        activeComp: '',
        homeTeam: {},
        awayTeam: {},
        match: {
          compId: 'ALI8o0eJ30V1D1Fb7rHV',
          homeTeamId: '',
          homeTeamName: '',
          homeTeamShortName: '',
          awayTeamId: '',
          awayTeamName: '',
          awayTeamShortName: '',
          isLocked: false,
          startDate: '',
          matchScore: '',
          matchWinner: '',
          awayScore: 0,
          homeScore: 0,
          numMaps: 4,
          maps: [
            {
              type: 'Control',
              winner: '',
              score: '',
              potg: ''
            },
            {
              type: 'Hybrid',
              winner: '',
              score: '',
              potg: ''
            },
            {
              type: 'Assault',
              winner: '',
              score: '',
              potg: ''
            },
            {
              type: 'Escort',
              winner: '',
              score: '',
              potg: ''
            }
          ]
        },
        message: ''
      }
    },
    computed: {
      validMatches: function () {
        var isValid = []
        this.oldMatches.forEach(function (match) {
          if (match.awayScore === '0' && match.homeScore === '0') {
            isValid.push(match)
          }
        })
        return isValid
      }
    },
    methods: {
      updateRecords: function () {
        if (this.match.awayTeamId === this.match.matchWinner) {
          this.awayTeam.wins++
          this.homeTeam.losses++
        } else {
          this.awayTeam.losses++
          this.homeTeam.wins++
        }
        fireTeam.updateWinLoss(this.match.awayTeamId, this.awayTeam.wins, this.awayTeam.losses).then(function (result) {
          if (result) console.log('Successfully saved away teams win/loss record')
        })
        fireTeam.updateWinLoss(this.match.homeTeamId, this.homeTeam.wins, this.homeTeam.losses).then(function (result) {
          if (result) console.log('Successfully saved home teams win/loss record')
        })
        this.resetForm(this.match.compId)
      },
      refreshTeams: function () {
        var _this = this
        if (this.activeComp) {
          fireTeam.getTeams(this.activeComp).then(function (teams) {
            _this.teams = teams
          })
        }
      },
      getMatch: function () {
        var _this = this
        if (this.activeMatch) {
          fireMatch.getMatchById(this.activeMatch).then(function (theMatch) {
            theMatch.matchScore = ''
            _this.match = theMatch
            fireTeam.getTeamById(theMatch.homeTeamId).then(function (teamData) {
              _this.homeTeam = teamData
            })
            fireTeam.getTeamById(theMatch.awayTeamId).then(function (teamData) {
              _this.awayTeam = teamData
            })
          })
        }
      },
      getMatchups: function () {
        var _this = this
        if (this.activeComp) {
          fireMatch.getOldLeagueMatches(this.activeComp).then(function (oldMatches) {
            _this.oldMatches = oldMatches
          })
        }
      },
      getCompetitions: function () {
        var _this = this
        fireComp.getCompetitions().then(function (comps) {
          _this.competitions = comps
        })
      },
      setWinner: function () {
        var _this = this
        console.log('Setting winner of match...')
        fireMatch.setWinner(_this.match, _this.activeMatch).then(function () {
          _this.message = 'Successfully updated the winner!'
          _this.updateRecords()
        })
      },
      resetForm: function (compId) {
        this.match = {
          compId: compId,
          homeTeamId: '',
          homeTeamName: '',
          homeTeamShortName: '',
          awayTeamId: '',
          awayTeamName: '',
          awayTeamShortName: '',
          isLocked: false,
          startDate: '',
          matchWinner: '',
          numMaps: 4,
          maps: [
            {
              type: 'Control',
              winner: '',
              score: '',
              potg: ''
            },
            {
              type: 'Hybrid',
              winner: '',
              score: '',
              potg: ''
            },
            {
              type: 'Assault',
              winner: '',
              score: '',
              potg: ''
            },
            {
              type: 'Escort',
              winner: '',
              score: '',
              potg: ''
            }
          ]
        }
      }
    },
    mounted: function () {
      this.getCompetitions()
    }
  }
</script>