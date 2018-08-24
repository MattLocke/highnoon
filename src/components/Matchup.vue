<template lang="pug">
  .matchup
    .box(v-if="isLoading")
      .centered
        img(src="/assets/img/loading.gif")
    section.section(v-else ref="matchupWrapper")
      .container
        .feature.box
          h1.title.text-border
            span.is-hidden-touch {{ match.homeTeamName }}
            span.is-hidden-desktop {{ match.homeTeamShortName }}
            span.orange-text vs
            span.is-hidden-touch {{ match.awayTeamName }}  -
            span.is-hidden-desktop {{ match.awayTeamShortName }} -
            span.orange-text {{ totalPoints }}
            | points
          p.match-date {{ match.startDate | formatDate }}
          .box
            .columns.is-mobile
              .column.centered
                h3.header-font.is-hidden-touch {{ match.homeTeamName }}
                h3.header-font.is-hidden-desktop {{ match.homeTeamShortName }}
                span(v-if="homeTeamRecord") {{ homeTeamRecord }}
                img.matchup-logo(v-bind:src="homeTeamLogo")
                button.button.positive-button.full-width(v-if="match.homeTeamId === picks.winner") WIN
                button.button.negative-button.full-width(v-else, @click="setWinner(match.homeTeamId, match.homeTeamName, match.homeTeamShortName, match.awayTeamShortName)") LOSE
                span.orange-text(v-if="showPoints && match.homeTeamId === picks.winner") 400pts
              .column.centered
                img.vs-logo(src="/assets/img/vs.png")
                hr
                //- Mobile score selector
                .columns.is-hidden-desktop
                  .column
                    label.score.overwatch-font {{ match.homeTeamShortName }}
                    .select
                      select(v-model="picks.homeScore")
                        option 0
                        option 1
                        option 2
                        option 3
                        option 4
                    span.is-block.orange-text(v-if="showPoints") 50pts
                  .column
                    label.score.overwatch-font {{ match.awayTeamShortName }}
                    .select
                      select(v-model="picks.awayScore")
                        option 0
                        option 1
                        option 2
                        option 3
                        option 4
                    span.orange-text.is-block(v-if="showPoints") 50pts
                //- Desktop score selector
                .columns.is-hidden-touch
                  .column
                    label.score.overwatch-font {{ match.homeTeamShortName }}
                    .select.is-large
                      select(v-model="picks.homeScore")
                        option 0
                        option 1
                        option 2
                        option 3
                        option 4
                    span.is-block.orange-text(v-if="showPoints") 50pts
                  .column
                    label.score.overwatch-font {{ match.awayTeamShortName }}
                    .select.is-large
                      select(v-model="picks.awayScore")
                        option 0
                        option 1
                        option 2
                        option 3
                        option 4
                    span.orange-text.is-block(v-if="showPoints") 50pts
              .column.centered
                h3.header-font.is-hidden-touch {{ match.awayTeamName }}
                h3.header-font.is-hidden-desktop {{ match.awayTeamShortName }}
                span(v-if="awayTeamRecord") {{ awayTeamRecord }}
                img.matchup-logo(v-bind:src="awayTeamLogo")
                button.button.positive-button.full-width(v-if="match.awayTeamId === picks.winner") WIN
                button.button.negative-button.full-width(v-else, @click="setWinner(match.awayTeamId, match.awayTeamName, match.awayTeamShortName, match.homeTeamShortName)") LOSE
                span.orange-text(v-if="showPoints && match.awayTeamId === picks.winner") 400pts
          .box
            label.checkbox
              input(type='checkbox' v-model="autoWinner" checked)
              |  Automatically set the higher score as winner of the match
            p
              a(v-if="!showTipInfo" v-on:click="showTipInfo = true") Why can I set it to where they can be different?
            p(v-if="showTipInfo") We let you optionally select impossible scores (3-3) so you have the options of hedging your bets.  This would give you a higher chance of 50pts (most of the time a team gets a score of 3 that wins), but also makes it so you have a 0% chance of 100pts.  We now default to higher score is set to winner, but you are free to change it up!
            a(v-if="showTipInfo" v-on:click="showTipInfo = false") Hide Tip
          winstonslab(:matchId="match.winstonsId" v-if="match.winstonsId")
          .box(v-if="!successfulPick && leagueInfo.simpleMode")
            .columns
              .column.centered
                label.checkbox
                  input(type="checkbox" v-model="applyToAll")
                  |  Apply this pick to all leagues I'm in for this competition (this will overwrite any picks you've made in other leagues for this matchup)
                br
                button.button.positive-button.is-large(v-on:click="setPick()" v-bind:class="{'is-loading': isLoading}" :disabled="isLoading" v-if="formComplete") Confirm
        .columns.is-desktop(v-if="!leagueInfo.simpleMode")
          .column(v-for="(map, index) in match.maps")
            .box
              h2.overwatch-font.text-border {{ map.name }}
              span.orange-text.overwatch-font {{ map.type }} -
                span.map-points.orange-text 100pts
              .box
                .columns.is-mobile
                  .column.centered
                    img.round-winner(v-bind:src="homeTeamLogo", v-on:click="setMapWinner(match.homeTeamName, index)")
                    h4.overwatch-font(v-bind:class="{'chosen': checkWinner(match.homeTeamName, index)}", v-on:click="setMapWinner(match.homeTeamName, index)") {{ match.homeTeamShortName }}
                  .column.centered(v-if="map.type !== 'Control'")
                    img.round-winner(src="/assets/img/tie.svg", v-on:click="setMapWinner('draw', index)")
                    h4.overwatch-font(v-bind:class="{'chosen': checkWinner('draw', index)}", v-on:click="setMapWinner('draw', index)") Draw
                  .column.centered(v-else)
                  .column.centered
                    img.round-winner(v-bind:src="awayTeamLogo", v-on:click="setMapWinner(match.awayTeamName, index)")
                    h4.overwatch-font(v-bind:class="{'chosen': checkWinner(match.awayTeamName, index)}", v-on:click="setMapWinner(match.awayTeamName, index)") {{ match.awayTeamShortName }}
                .columns.is-mobile(v-if="pickStats.mapStats[index]")
                  .column.centered
                    span {{ Math.round(pickStats.mapStats[index].homePercent) }}%
                  .column.centered(v-if="map.type !== 'Control'")
                    span {{ Math.round(pickStats.mapStats[index].extraPercent) }}%
                  .column.centered(v-else)
                  .column.centered
                    span {{ Math.round(pickStats.mapStats[index].awayPercent) }}%
        .columns.is-desktop
          .column.is-one-quarter-desktop(v-if="!leagueInfo.simpleMode")
            .box
              h2.overwatch-font.text-border Tie Breaker
              span.overwatch-font.orange-text Control - 100pts
              .box
                .columns.is-mobile
                  .column.centered
                    img.round-winner(v-bind:src="homeTeamLogo", v-on:click="setTieWinner(match.homeTeamName)")
                    h4.overwatch-font(v-bind:class="{'chosen': tieWinner(match.homeTeamName)}", v-on:click="setTieWinner(match.homeTeamName)") {{ match.homeTeamShortName }}
                  .column.centered
                    img.round-winner(src="/assets/img/tie.svg", v-on:click="setTieWinner('none')")
                    h4.overwatch-font(v-bind:class="{'chosen': tieWinner('none')}", v-on:click="setTieWinner('none')") None
                  .column.centered
                    img.round-winner(v-bind:src="awayTeamLogo", v-on:click="setTieWinner(match.awayTeamName)")
                    h4.overwatch-font(v-bind:class="{'chosen': tieWinner(match.awayTeamName)}", v-on:click="setTieWinner(match.awayTeamName)") {{ match.awayTeamShortName }}
                .columns.is-mobile(v-if="pickStats.tieBreakerStats")
                  .column.centered
                    span {{ Math.round(pickStats.tieBreakerStats.homePercent) }}%
                  .column.centered
                    span {{ Math.round(pickStats.tieBreakerStats.extraPercent) }}%
                  .column.centered
                    span {{ Math.round(pickStats.tieBreakerStats.awayPercent) }}%
          .column.is-one-quarter-desktop(v-if="leagueInfo.simpleMode")
            .box
              h2.overwatch-font.text-border Maps
              table.table.is-fullwidth.is-striped.map-listing
                tr(v-for="(map, index) in match.maps")
                  td.position {{ index + 1 }}
                  td {{ map.name }}
                    span.map-type {{ map.type }}
          .column.is-one-quarter-desktop
            .box
              roster(:teamId="match.homeTeamId", :logoUrl="homeTeamLogo")
          .column.is-one-quarter-desktop
            .box
              roster(:teamId="match.awayTeamId", :logoUrl="awayTeamLogo")
          .column.is-one-quarter-desktop
            .box
              pick-rates(:matchId="matchId")
            .box
              h2.text-border All Team Stats
              .spacer
              router-link.button.positive-button(to="/Stats") See All Stats
        .box(v-if="!successfulPick && !leagueInfo.simpleMode")
          .columns
            .column.centered
              .field
                label.checkbox
                  input(type="checkbox" v-model="applyToAll")
                  |  Apply this pick to all leagues I'm in for this competition (this will overwrite any picks you've made in other leagues for this matchup)
              .field(v-if="nextMatchId")
                label.checkbox
                  input(type="checkbox" v-model="goNextPick")
                  |  Go to next pick
              button.button.positive-button.is-large(v-on:click="setPick()" v-bind:class="{'is-loading': isLoading}" :disabled="isLoading" v-if="formComplete") Confirm Your Pick'em
              button.button.negative-button.is-large(v-else) Complete Form First
        .box(v-if="successfulPick")
          .columns
            .column.centered
              p You've successfully placed your pick!
              a.button.negative-button(v-on:click="returnToLeague()") Return to League
            .column.centered
              p You may still update this pick.
              a.button.button.positive-button(v-on:click="setPick()" v-bind:class="{'is-loading': isLoading}" :disabled="isLoading") Update Your Pick'em
              .wrap
                label.checkbox
                  input(type="checkbox" v-model="applyToAll")
                  |  Apply this pick to all leagues I'm in for this competition
        .box
          .columns
            .column
              h3.overwatch-font.text-border Pick Summary
              p Winner: {{ picks.winnerName }}
              p Score: {{ picks.homeScore }} - {{ picks.awayScore }}
</template>

<script>
import firebase from 'firebase'
import fireMatch from '@/services/match'
import fireTeam from '@/services/team'
import fireImage from '@/services/image'
import firePick from '@/services/pick'
import fireLeague from '@/services/league'
import fireStats from '@/services/stats'
import roster from '@/components/matchups/Roster'
import pickRates from '@/components/matchups/PickRates'
import winstonslab from '@/components/matchups/Winstons'

export default {
  name: 'matchup',
  components: {
    winstonslab,
    roster,
    pickRates
  },
  data () {
    return {
      showTipInfo: false,
      loading: true,
      applyToAll: true,
      successfulPick: false,
      goNextPick: true,
      showPoints: true,
      leagueInfo: {},
      matchId: '',
      leagueId: '',
      userId: '',
      isLoading: false,
      pickId: '',
      homeTeamLogo: '',
      awayTeamLogo: '',
      autoWinner: true,
      homeTeamData: {},
      awayTeamData: {},
      match: {},
      picks: {
        loserShortName: '',
        homeScore: 0,
        awayScore: 0,
        winner: '',
        winnerName: '',
        winnerShortName: '',
        score: '',
        startDate: '',
        tieWinner: '',
        maps: [],
        stage: 2,
        week: 1
      },
      pickStats: {}
    }
  },
  computed: {
    nextMatchId: function () {
      // _this.$router.push({path: '/Login/' + _this.leagueId})
      return this.$store.getters.getNextMatch(this.match.id) || false
    },
    homeScore: function () {
      return this.picks.homeScore
    },
    awayScore: function () {
      return this.picks.awayScore
    },
    homeTeamRecord: function () {
      let homeRecord = false
      if (this.homeTeamData) {
        if (this.homeTeamData.wins || this.homeTeamData.losses) {
          homeRecord = '(' + this.homeTeamData.wins + ' - ' + this.homeTeamData.losses + ')'
        }
      }
      return homeRecord
    },
    awayTeamRecord: function () {
      let awayRecord = false
      if (this.awayTeamData) {
        if (this.awayTeamData.wins || this.awayTeamData.losses) {
          awayRecord = '(' + this.awayTeamData.wins + ' - ' + this.awayTeamData.losses + ')'
        }
      }
      return awayRecord
    },
    totalPoints: function () {
      if (this.match.maps && !this.leagueInfo.simpleMode) return 500 + (this.match.maps.length * 100) + 100
      else return 500
    },
    currentStage: function () {
      return this.$store.getters.currentStage
    },
    isAdmin: function () {
      return false
    },
    formComplete: function () {
      var isComplete = false
      if (this.picks.winner && this.picks.homeScore >= 0 && this.picks.awayScore >= 0) {
        if (this.leagueInfo.simpleMode) {
          isComplete = true
        } else {
          if (this.picks.maps[3]) {
            if (this.picks.maps[0].winner && this.picks.maps[1].winner && this.picks.maps[2].winner && this.picks.maps[3].winner && this.picks.tieWinner.length) isComplete = true
            else isComplete = false
          } else isComplete = false
        }
      }
      return isComplete
    }
  },
  watch: {
    homeScore: function () {
      if (this.autoWinner) {
        if (this.awayScore < this.homeScore) this.setWinner(this.match.homeTeamId, this.match.homeTeamName, this.match.homeTeamShortName, this.match.awayTeamShortName)
        else this.setWinner(this.match.awayTeamId, this.match.awayTeamName, this.match.awayTeamShortName, this.match.homeTeamShortName)
      }
    },
    awayScore: function () {
      if (this.autoWinner) {
        if (this.awayScore < this.homeScore) this.setWinner(this.match.homeTeamId, this.match.homeTeamName, this.match.homeTeamShortName, this.match.awayTeamShortName)
        else this.setWinner(this.match.awayTeamId, this.match.awayTeamName, this.match.awayTeamShortName, this.match.homeTeamShortName)
      }
    }
  },
  methods: {
    getPickPercents: function () {
      var _this = this
      // check to see if we have it in the store already
      if (_this.matchId) {
        fireStats.getPickPercent(_this.matchId).then(function (pickStats) {
          _this.pickStats = pickStats
        })
      }
    },
    setWinner: function (id, name, shortName, loserShortName) {
      this.picks.winner = id
      this.picks.winnerName = name
      this.picks.winnerShortName = shortName
      this.picks.loserShortName = loserShortName
    },
    setMapWinner: function (choice, index) {
      this.picks.maps[index].winner = choice
    },
    setTieWinner: function (teamName) {
      this.picks.tieWinner = teamName
    },
    checkWinner: function (a, index) {
      if (this.picks.maps[index]) {
        var b = this.picks.maps[index].winner
        return a === b
      } else return false
    },
    tieWinner: function (teamName) {
      return this.picks.tieWinner === teamName
    },
    setPick: function () {
      var _this = this
      var pickData = this.picks
      _this.isLoading = true
      pickData.leagueId = this.leagueId
      pickData.matchId = this.matchId
      pickData.compId = this.leagueInfo.competitionId
      pickData.userId = this.userId
      pickData.matchup = this.match.homeTeamShortName + ' vs ' + this.match.awayTeamShortName
      pickData.points = 0
      pickData.stage = this.currentStage
      // Make sure the matchup isn't locked, for those sneaky folk!
      fireMatch.getMatchById(this.matchId).then(function (match) {
        if (!match.isLocked) {
          if (_this.pickId) {
            firePick.updatePick(pickData, _this.pickId, _this.applyToAll).then(function (returnData) {
              _this.successfulPick = true
              _this.isLoading = false
              _this.applyToAll = false
              if (_this.nextMatchId && _this.goNextPick) _this.goToNextMatch()
              else _this.returnToLeague()
            })
          } else {
            firePick.createPick(pickData, _this.applyToAll).then(function (returnData) {
              _this.successfulPick = true
              _this.pickId = returnData
              _this.isLoading = false
              _this.applyToAll = false
              if (_this.nextMatchId && _this.goNextPick) _this.goToNextMatch()
              else _this.returnToLeague()
            })
          }
        }
      })
    },
    goToNextMatch: function () {
      this.$router.push({path: '/Matchup/' + this.picks.maps.length + '/' + this.leagueId + '/' + this.nextMatchId})
    },
    returnToLeague: function () {
      this.$router.push({path: '/ViewLeague/' + this.leagueId})
    }
  },
  mounted: function () {
    var _this = this
    /* eslint-disable no-undef */
    this.matchId = this.$route.params.matchId
    this.leagueId = this.$route.params.leagueId
    var numMaps = this.$route.params.numMaps
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        _this.userId = user.uid
        if (!user.emailVerified) _this.$router.push({path: '/'})
        // set the maps here so when changed vue can see em
        for (var i = 0; i < numMaps; i++) {
          _this.picks.maps.push({winner: '', score: '', potg: ''})
        }
        _this.getPickPercents()
        fireMatch.getMatchById(_this.matchId).then(function (match) {
          _this.$store.dispatch('savePickMatch', _this.matchId)
          _this.match = match
          _this.picks.winner = match.homeTeamId
          _this.picks.winnerName = match.homeTeamName
          _this.picks.winnerShortName = match.homeTeamShortName
          _this.picks.loserShortName = match.awayTeamShortName
          _this.picks.stage = match.stage
          _this.picks.counted = false
          _this.picks.startDate = match.startDate
          _this.homeTeamLogo = fireImage.getLocalTeamLogo(match.homeTeamLogo)
          _this.awayTeamLogo = fireImage.getLocalTeamLogo(match.awayTeamLogo)
          fireTeam.getTeamById(match.homeTeamId).then(function (team) {
            _this.homeTeamData = team
          })
          fireTeam.getTeamById(match.awayTeamId).then(function (team) {
            _this.awayTeamData = team
          })
          _this.$refs.matchupWrapper.scrollIntoView()
        })

        fireLeague.getLeagueById(_this.leagueId).then(function (league) {
          _this.leagueInfo = league.data
        })

        if (_this.$route.params.pickId) {
          // we have a pick, and should be in edit mode.
          _this.pickId = _this.$route.params.pickId
          firePick.getPickById(_this.pickId).then(function (pick) {
            _this.picks = pick
          })
        } else {
          // in case they link directly to pick, check to see if there's one to load in
          firePick.checkExisting({userId: _this.userId, matchId: _this.matchId, leagueId: _this.leagueId}).then(function (pickId) {
            if (pickId) {
              firePick.getPickById(pickId).then(function (pick) {
                _this.picks = pick
              })
            }
          })
        }
      } else _this.$router.push({path: '/'})
    })
  }
}
</script>

<style lang="scss" scoped>
  @import '../variables.scss';
  .vs-logo {
    display: block;
    margin: auto;
  }
  .map-listing {
    font-size: 1.2rem;
  }
  .map-type {
    display: block;
    font-size: .8rem;
    margin-top: -.4rem;
  }
  .round-winner {
    height: 10vw;
    max-height: 100px;
    width: auto;
    &:hover {
      cursor: pointer;
    }
  }
  .chosen {
    color: $owp-orange;
    border-bottom: 2px solid $owp-orange;
  }
  .score {
    display: block;
  }
  .matchup-logo {
    height: 128px;
    width: auto;
    display: block;
    margin: auto;
  }
  .match-date {
    margin-top: -1.5rem;
  }
  .match-option {
    padding-top: .75rem;
    text-align: center;
    .label {
      display: block;
      font-weight: normal;
      margin-bottom: 0;
    }
  }
  .box {
    margin-bottom: 1.5rem!important;
  }
</style>
