<template lang="pug">
  .fast-pick-listing
    .wrap
      .feature(v-bind:class="{ box: seePick }")
        h2.title(v-on:click="seePick = !seePick")
          img.header-icon(v-bind:src="match.homeLogoUrl")
          span.is-hidden-touch {{ match.homeTeamName }}
          span.is-hidden-desktop {{ match.homeTeamShortName }}
          span.orange-text vs
          span.is-hidden-touch {{ match.awayTeamName }}
          span.is-hidden-desktop {{ match.awayTeamShortName }}
          img.header-icon(v-bind:src="match.awayLogoUrl")
        .wrap.not-picked.centered(v-if="!pickId")
          span.tag.is-danger.is-small.base-font Not Picked
        p.match-date {{ match.startDate | formatDate }} -
          span.orange-text {{ totalPoints }}
          | points
        .wrap(v-show="seePick")
          .box.no-pad-bottom
            .columns.is-mobile
              .column.is-narrow
                .wrap(v-bind:class="{'chosen': match.homeTeamId === picks.winner}")
                  img.matchup-logo(v-bind:src="match.homeLogoUrl" @click="setWinner(match.homeTeamId, match.homeTeamName, match.homeTeamShortName, match.awayTeamShortName)")
                  span.black-text(v-if="showPoints && match.homeTeamId === picks.winner") 400pts
              .column.is-narrow
                .select.is-small
                  select(v-model="picks.homeScore")
                    option 0
                    option 1
                    option 2
                    option 3
                    option(v-if="match.stage != 'Playoffs'") 4
                span.is-block.orange-text(v-if="showPoints") 50pts
              .column.is-narrow
                .select.is-small
                  select(v-model="picks.awayScore")
                    option 0
                    option 1
                    option 2
                    option 3
                    option(v-if="match.stage != 'Playoffs'") 4
                span.orange-text.is-block(v-if="showPoints") 50pts
              .column.is-narrow
                .wrap(v-bind:class="{'chosen': match.awayTeamId === picks.winner}")
                  img.matchup-logo(v-bind:src="match.awayLogoUrl" @click="setWinner(match.awayTeamId, match.awayTeamName, match.awayTeamShortName, match.awayTeamShortName)")
                  span.black-text(v-if="showPoints && match.awayTeamId === picks.winner") 400pts
              .column.centered.is-hidden-touch
                button.button.positive-button.is-medium(v-if="!showStats" v-on:click="showStats = !showStats") Show Stats
                button.button.negative-button.is-medium(v-else v-on:click="showStats = !showStats") Hide Stats
              .column.is-hidden-touch
                .field
                  label.checkbox.apply-all
                    input(type="checkbox" v-model="applyToAll")
                    |  Apply to all leagues.
              .column.is-hidden-touch
                button.button.positive-button.is-medium.is-pulled-right(v-on:click="setPick()" v-bind:class="{'is-loading': isLoading}" :disabled="isLoading" v-if="formComplete")
                  span(v-if="!pickId") Confirm Your Pick'em
                  span(v-else) Update Your Pick'em
                button.button.negative-button.is-medium.is-pulled-right(v-else) Complete Form First
            .wrap
              hr.is-hidden-desktop
              .wrap.is-hidden-desktop
                pick-rates(:matchId="match.id")
              .columns(v-if="!leagueInfo.simpleMode")
                .column.is-one-fifth-desktop(v-for="(map, index) in match.maps")
                  .wrap.map-item
                    h4.overwatch-font.text-border.drop-shadow {{ map.name }}
                      span.orange-text.overwatch-font {{ map.type }}
                        span(v-if="showPoints").map-points.orange-text - 100pts
                    .columns.is-mobile
                      .column.centered
                        .wrap(v-bind:class="{'chosen': checkWinner(match.homeTeamName, index)}")
                          img.round-winner(v-bind:src="match.homeLogoUrl", v-on:click="setMapWinner(match.homeTeamName, index)")
                      .column.centered(v-if="map.type !== 'Control'")
                        .wrap(v-bind:class="{'chosen': checkWinner('draw', index)}")
                          img.round-winner.is-draw(src="/assets/img/tie.svg", v-on:click="setMapWinner('draw', index)")
                      .column.centered(v-else)
                      .column.centered
                        .wrap(v-bind:class="{'chosen': checkWinner(match.awayTeamName, index)}")
                          img.round-winner(v-bind:src="match.awayLogoUrl", v-on:click="setMapWinner(match.awayTeamName, index)")
                .column.is-one-fifth-desktop(v-if="!leagueInfo.simpleMode && match.stage != 'Playoffs'")
                  .wrap.map-item
                    h4.overwatch-font.text-border.drop-shadow Tie Breaker
                      span.overwatch-font.orange-text Control
                        span(v-if="showPoints") - 100pts
                    .columns.is-mobile
                      .column.centered
                        .wrap(v-bind:class="{'chosen': tieWinner(match.homeTeamName)}")
                          img.round-winner(v-bind:src="match.homeLogoUrl", v-on:click="setTieWinner(match.homeTeamName)")
                      .column.centered
                        .wrap(v-bind:class="{'chosen': tieWinner('none')}")
                          img.round-winner.is-draw(src="/assets/img/tie.svg", v-on:click="setTieWinner('none')")
                      .column.centered
                        .wrap(v-bind:class="{'chosen': tieWinner(match.awayTeamName)}")
                          img.round-winner(v-bind:src="match.awayLogoUrl", v-on:click="setTieWinner(match.awayTeamName)")
              .columns(v-if="!leagueInfo.simpleMode && match.stage == 'Playoffs'")
                .column
                  .notification.is-warning
                    p * If you believe the map won't be played, please choose
                      img(src="/assets/img/tie.svg" style="height: 1rem; width: 1rem;")
                      | .  Thank you!
              .columns.is-hidden-desktop
                .column.centered
                  .field
                    label.checkbox.apply-all
                      input(type="checkbox" v-model="applyToAll")
                      |  Apply to all leagues.
                .column.centered
                  button.button.positive-button.is-medium(v-on:click="setPick()" v-bind:class="{'is-loading': isLoading}" :disabled="isLoading" v-if="formComplete")
                    span(v-if="!pickId") Confirm Your Pick'em
                    span(v-else) Update Your Pick'em
                  button.button.negative-button.is-medium(v-else) Complete Form First
            .wrap(v-show="showStats")
              .columns
                .column.is-half
                  .box
                    roster(:teamId="match.homeTeamId", :logoUrl="match.homeLogoUrl")
                .column.is-half
                  .box
                    roster(:teamId="match.awayTeamId", :logoUrl="match.awayLogoUrl")
              .columns
                .column
                  .box(v-if="match.id")
                    pick-rates(:matchId="match.id")
                    p We will be adding many more stats here in the coming weeks.  Stay tuned!
                .column
                  .box
                    h2.text-border All Team Stats
                    .spacer
                    router-link.button.positive-button(to="/Stats") See All Stats
</template>

<script>
import fireMatch from '@/services/match'
import firePick from '@/services/pick'
import roster from '@/components/matchups/Roster'
import pickRates from '@/components/matchups/PickRates'
import winstonslab from '@/components/matchups/Winstons'

export default {
  name: 'fastPickListing',
  components: {
    winstonslab,
    roster,
    pickRates
  },
  props: [
    'match',
    'showPoints',
    'autoWinner',
    'leagueInfo',
    'leagueId',
    'userId',
    'seeAllPicks'
  ],
  data () {
    return {
      showTipInfo: false,
      showStats: false,
      seePick: false,
      loading: true,
      applyToAll: true,
      successfulPick: false,
      goNextPick: true,
      matchId: '',
      isLoading: false,
      pickId: '',
      homeTeamData: {},
      awayTeamData: {},
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
        maps: [
          {
            winner: ''
          }
        ],
        stage: 2,
        week: 1
      }
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
          if (this.picks.maps[4]) {
            if (this.picks.maps[0].winner && this.picks.maps[1].winner && this.picks.maps[2].winner && this.picks.maps[3].winner && this.picks.maps[4].winner) isComplete = true
            else isComplete = false
          } else if (this.picks.maps[3]) {
            if (this.picks.maps[0].winner && this.picks.maps[1].winner && this.picks.maps[2].winner && this.picks.maps[3].winner && this.picks.tieWinner.length) isComplete = true
          } else isComplete = false
        }
      }
      return isComplete
    }
  },
  watch: {
    seeAllPicks: function (val) {
      if (val) this.seePick = true
      else this.seePick = false
    },
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
    checkExisting: function () {
      let _this = this
      firePick.checkExisting({userId: _this.userId, matchId: _this.match.id, leagueId: _this.leagueId}).then(function (pickId) {
        if (pickId) {
          _this.pickId = pickId
          firePick.getPickById(pickId).then(function (pick) {
            _this.picks = pick
          })
        }
      })
    },
    getBgImage: function (name) {
      name = name.replace('\'', '')
      return '/assets/img/maps/' + name + '.jpg'
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
      pickData.matchId = this.match.id
      pickData.compId = this.leagueInfo.competitionId
      pickData.userId = this.userId
      pickData.startDate = this.match.startDate
      pickData.counted = false
      pickData.matchup = this.match.homeTeamShortName + ' vs ' + this.match.awayTeamShortName
      pickData.points = 0
      pickData.stage = this.currentStage
      // Make sure the matchup isn't locked, for those sneaky folk!
      fireMatch.getMatchById(this.match.id).then(function (match) {
        if (!match.isLocked) {
          if (_this.pickId) {
            firePick.updatePick(pickData, _this.pickId, _this.applyToAll).then(function (returnData) {
              _this.successfulPick = true
              _this.isLoading = false
            })
          } else {
            firePick.createPick(pickData, _this.applyToAll).then(function (returnData) {
              _this.successfulPick = true
              _this.pickId = returnData
              _this.checkExisting()
              _this.isLoading = false
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
    _this.match.maps.forEach(map => _this.picks.maps.push(map))

    _this.checkExisting()
  }
}
</script>

<style lang="scss" scoped>
  @import '../../variables.scss';
  .header-icon {
    height: 1.6rem;
    line-height: 2rem;
    display: inline-block;
    width: auto;
  }
  .map-item {
    background-color: $owp-ltgrey;
    margin: 0 -.5rem .5rem -.5rem;
    padding: 0 .5rem;
  }
  .tag {
    margin-left: .25rem;
  }
  h2.title {
    color: $owp-dkblue;
    cursor: pointer;
    text-align: center;
    margin-bottom: 0;
  }
  .no-pad-bottom {
    padding-bottom: 0;
  }
  .black-text {
    color: #222;
  }
  .drop-shadow {
    background-color: rgba(255,255,255,0.4);
  }
  .has-map {
    border-radius: 4px;
    padding: .5rem;
    background-size: cover;
  }
  .apply-all {
    line-height: 40px;
  }
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
    height: 40px;
    width: auto;
    &:hover {
      cursor: pointer;
    }
  }
  .is-draw {
    height: 30px;
    margin-top: 10px;
    padding-bottom: 5px;
  }
  .chosen {
    color: $owp-orange;
    border-bottom: 2px solid $owp-orange;
    border-radius: 4px;
    background-color: $owp-orange;
  }
  .score {
    display: block;
  }
  .matchup-logo {
    height: 40px;
    width: auto;
    display: block;
    margin: auto;
  }
  .match-date {
    margin-top: 0;
    text-align: center;
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
