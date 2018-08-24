<template lang="pug">
  .viewleague
    section.section
      .container
        .box(name="top")
          .columns.is-desktop
            .column
              h1.text-border {{ leagueData.name }}
              span.overwatch-font {{ leagueData.competitionName }}
              span.orange-text.overwatch-font - {{ leagueMode }}
        .box(v-if="inLeague && activeMatch")
          h2 Current Match
          pick-stat-listing(:pick="activeMatchPick", :leagueData="leagueData")
        .box(v-if="inLeague && matchups.length")
          fast-picks(:matchups="matchups", :verified="verified", :leagueId="leagueId", :leagueData="leagueData" :userId="user.uid")
        .columns
          .column.is-one-quarter-desktop
            .box(v-if="isAdmin")
              h2 League Limit
              p Adjust the maximum number of users for this league.
              input.input(v-model="leagueData.maxUsers")
              .spacer
              a.button.positive-button(v-on:click="updateMaxUsers()") Update
              p(v-if="updateUserSuccess") Successfully updated!
            .box(v-if="leaguePicks.length")
              h2 Your Picks
              paginate-links(for="leaguePicks" :hide-single-page="true")
              table.table.is-fullwidth.is-striped.owp-orange-border
                thead
                  tr
                    th Matchup
                    th Score
                    th Pts
                paginate(name="leaguePicks" :list="leaguePicks" :per="12" tag="tbody")
                  tr(v-for="leaguePick in paginated('leaguePicks')")
                    td(v-html="pickWinnerDisplay(leaguePick)")
                    td {{ leaguePick.homeScore }} - {{ leaguePick.awayScore }}
                    td {{ leaguePick.points }}
              .spacer
                a(v-on:click="seeStats = true" v-if="!seeStats") See Details
                a(v-on:click="seeStats = false" v-else) Hide Details
            .box(v-if="!seeStats && inLeague")
              h2.text-border Stream Chat!
              p Watch the game while chatting with your fellow league members!  This is an alpha, so please report any errors/issues/suggestions you may have!
              a.button.positive-button(v-bind:href="streamChatLink") Stream Chat
            .box(v-if="!seeStats")
              patreon
            .box(v-if="canJoinLeague")
              h2 Join League
              .subwrap(v-if="hasPassword")
                input.input(placeholder="Enter Password", v-model="password")
                p This league requires a password.  Please enter it to join the league.
                a.button.positive-button(v-on:click="joinPwLeague()" v-if="!joiningLeague && password.length") Join League
                p(v-if="badPassword") Invalid Password.
              .subwrap(v-else)
                a.button.positive-button(v-on:click="joinLeague()" v-if="!joiningLeague") Join League
              a.button.negative-button(v-if="joiningLeague && !joinLeagueSuccess") Joining League
            .box(v-if="maxUsers")
              h2 League Full
              p This league has reached it's maximum user count.  If you are the owner, please contact SouldrinK on discord to raise the limit.
            .box(v-if="isOwner && !seeStats")
              h2.text-border Manage League
                span.button.is-small.negative-button.is-pulled-right(v-if="showManage", v-on:click="showManage = false") collapse
                span.button.is-small.positive-button.is-pulled-right(v-else, v-on:click="showManage = true") show
              .manage-wrapper(v-if="showManage")
                .subwrap
                  password(:isOwner="isOwner", :leagueId="leagueId")
                  hr
                .subwrap(v-if="!leagueData.isLocked && !seeStats")
                  h3.overwatch-font Invite Link
                  p
                    a.button.positive-button(v-on:click="copyClipboard()")
                      span(v-if="notCopied") Copy To Clipboard
                      span(v-else) Copied!
                  hr
                .subwrap(v-if="isOwner && !seeStats")
                  remove-user(:leagueId="leagueId" :users="leagueUsers" :ownerId="leagueData.ownerId")
                  hr
                .subwrap(v-if="isOwner && !oldMatchups.length && !seeStats")
                  toggle-simple(:leagueData="leagueData", :leagueId="leagueId")
                  hr
                //- .subwrap(v-if="isOwner && !seeStats")
                  toggle-lottery(:leagueData="leagueData", :leagueId="leagueId")
                .subwrap(v-if="isOwner && !seeStats")
                  delete-league(:leagueId="leagueId")
            .box(v-if="!isOwner && inLeague && !seeStats")
              leave-league(:leagueId="leagueId" :userId="user.uid" ref="leaveModal")
          .column.is-three-quarters-desktop
            .box.hide-overflow(v-show="!seeStats")
              a.button.negative-button.is-small.is-pulled-right(v-on:click="showMotd = false" v-if="showMotd") collapse
              a.button.negative-button.is-small.is-pulled-right(v-on:click="showMotd = true" v-if="!showMotd") show league message
              .is-clearfix(v-if="!showMotd")
              .wrap(v-if="showMotd")
                vue-markdown(:source="leagueData.motd")
              .motd-wrapper(v-if="showMotdEdit")
                span This uses markdown.
                  a(href="http://commonmark.org/help/" target="_blank") Here is a quick reference guide.
                textarea.textarea(row='4' v-model="leagueData.motd") {{ leagueData.motd }}
                button.button.positive-button(v-on:click="updateMotd()") Save and close
              .motd-wrapper(v-if="!showMotdEdit && isOwner && showMotd")
                a(v-on:click="showMotdEdit = true") Edit League Message
            .box(v-show="!seeStats")
              a.button.negative-button.is-small.is-pulled-right(v-on:click="showStandings = false" v-if="showStandings") collapse
              a.button.negative-button.is-small.is-pulled-right(v-on:click="showStandings = true" v-if="!showStandings") show standings
              .is-clearfix(v-if="!showStandings")
              .wrap(v-if="showStandings")
                league-leaderboard(:leagueUsers="leagueUsers", :leagueData="leagueData")
            .box(v-show="seeStats")
              pick-stats(:oldMatchups='oldMatchups', :matchups='matchups', :leaguePicks='leaguePicks', :leagueData='leagueData')
              a(v-on:click="seeStats = false") Hide Details
            comments(:userData="userData", :leagueId="leagueId", :isOwner="isOwner", :verified="verified", :inLeague="inLeague")
</template>

<script>
import clipboard from 'clipboard-polyfill'
import firebase from 'firebase'
import fireLeague from '@/services/league'
import fireMatch from '@/services/match'
import fireImage from '@/services/image'
import firePick from '@/services/pick'
import fireTeam from '@/services/team'
import leaveLeague from '@/components/league/leaveLeague'
import deleteLeague from '@/components/league/deleteLeague'
import removeUser from '@/components/league/removeUser'
import toggleSimple from '@/components/league/toggleSimple'
import toggleLottery from '@/components/league/toggleLottery'
import vueMarkdown from 'vue-markdown'
import comments from '@/components/league/comments'
import password from '@/components/league/password'
import importPicks from '@/components/league/importPicks'
import pickStats from '@/components/league/pickStats'
import pickStatListing from '@/components/league/pickStatListing'
import patreon from '@/components/reusable/Patreon'
import upcomingMatches from '@/components/league/upcomingMatches'
import leagueLeaderboard from '@/components/league/leagueLeaderboard'
import fastPicks from '@/components/league/fastPicks'
// import gravatar from '@/services/gravatar'

export default {
  name: 'viewleague',
  components: {
    leaveLeague,
    deleteLeague,
    removeUser,
    toggleSimple,
    toggleLottery,
    vueMarkdown,
    comments,
    password,
    importPicks,
    pickStats,
    patreon,
    upcomingMatches,
    leagueLeaderboard,
    pickStatListing,
    fastPicks
  },
  data () {
    return {
      paginate: ['leagueLeaderboardUsers', 'leaguePicks'],
      showMotd: true,
      showMotdEdit: false,
      showStandings: true,
      leagueData: {},
      leagueUsers: [],
      leagueId: '',
      leaguePicks: [],
      isOwner: false,
      joiningLeague: false,
      joinLeagueSuccess: false,
      hasPassword: false,
      badPassword: false,
      password: '',
      inLeague: false,
      notCopied: true,
      user: {},
      matchups: [],
      oldMatchups: [],
      teams: [],
      seeStats: false,
      showManage: true,
      verified: false,
      numberLeagues: 100,
      leaderTab: 0,
      updateUserSuccess: false,
      activeMatch: null,
      activeMatchPick: null
    }
  },
  methods: {
    getActiveMatchPick: function () {
      // find the active match, then see if they have a pick - if not, return null so it doesn't even show.
      var _this = this
      var thePick = {}

      fireMatch.getActiveMatch().then(function (matches) {
        if (matches.length) {
          var orderedMatches = matches.sort(function (a, b) { return (a.startDate < b.startDate) ? 1 : ((b.startDate < a.startDate) ? -1 : 0) })
          var tmpMatch = orderedMatches[0]

          tmpMatch.homeLogoUrl = '' // set because of race condition with async and vue render
          tmpMatch.awayLogoUrl = ''
          tmpMatch.hasPick = true
          tmpMatch.pickId = 0
          fireImage.getTeamLogo(tmpMatch.homeTeamLogo).then(function (url) {
            tmpMatch.homeLogoUrl = url
          })
          fireImage.getTeamLogo(tmpMatch.awayTeamLogo).then(function (url) {
            tmpMatch.awayLogoUrl = url
          })
          _this.activeMatch = tmpMatch || null
          thePick.oldMatchup = _this.activeMatch
          firePick.getPicksForMatchByUser(_this.activeMatch.id, _this.user.uid, _this.leagueId).then(function (picks) {
            if (picks.length) thePick.myPick = picks[0]
            _this.activeMatchPick = thePick
          })
        } else {
          _this.activeMatchPick = null
          _this.activeMatch = null
        }
      })
    },
    updateMaxUsers: function () {
      var _this = this
      fireLeague.setMaxUsers(this.leagueId, this.leagueData.maxUsers).then(function () {
        _this.updateUserSuccess = true
      })
    },
    showTab: function (tab) {
      this.leaderTab = tab
      // check to see if the data is loaded already
      // download data if it doesn't
    },
    pickWinnerDisplay: function (leaguePick) {
      var teams = leaguePick.matchup.split(' vs ')
      var display = ''
      if (teams[0] === leaguePick.winnerShortName) display = '<b>' + teams[0] + '</b> vs ' + teams[1]
      else display = teams[0] + ' vs <b>' + teams[1] + '</b>'
      return display
    },
    updateMotd: function () {
      var _this = this
      fireLeague.updateMotd(_this.leagueId, _this.leagueData.motd).then(function (result) {
        if (result) _this.showMotdEdit = false
      })
    },
    lockLeague: function () {
      var _this = this
      fireLeague.lockLeague(_this.leagueId).then(function (result) {
        if (result) _this.leagueData.isLocked = true
      })
    },
    getGravatar: function (email) {
      return 'http://via.placeholder.com/64x64'
      // return gravatar.getProfilePic(email, 64)
    },
    copyClipboard: function () {
      clipboard.writeText(this.leagueUrl)
      this.notCopied = false
    },
    unlockLeague: function () {
      var _this = this
      fireLeague.unlockLeague(_this.leagueId).then(function (result) {
        if (result) _this.leagueData.isLocked = false
      })
    },
    joinPwLeague: function () {
      var _this = this
      _this.joiningLeague = true
      _this.badPassword = false
      fireLeague.checkLeaguePassword(_this.leagueId, _this.password).then(function (isValid) {
        if (isValid) _this.joinLeague()
        else {
          // not sure yet
          _this.badPassword = true
          _this.joiningLeague = false
        }
      })
    },
    joinLeague: function () {
      var _this = this
      _this.joiningLeague = true
      // leagueId, leagueName, userDisplayName, userId
      var payLoad = {
        leagueId: this.leagueId,
        compId: this.leagueData.competitionId,
        leagueName: this.leagueData.name,
        userDisplayName: this.userData.displayName,
        simpleMode: this.leagueData.simpleMode,
        userId: this.user.uid,
        points: 0,
        active: true
      }
      fireLeague.joinLeague(payLoad).then(function (result) {
        if (result) _this.leagueUsers.push(payLoad) // no point in what could be a huge db pull to refresh user list.
        _this.joinLeagueSuccess = true
        _this.inLeague = true
      }, function (error) {
        console.error(error)
        _this.joiningLeague = false
      })
    },
    getPicks: function () {
      var _this = this
      _this.$nextTick(function () {
        firePick.getPicks(_this.user.uid, _this.leagueId, _this.currentStage).then(function (results) {
          if (results.length) {
            // TODO: update source map order.
            var tmpPicks = []
            var mapTypes = [
              'Escort',
              'Assault',
              'Control',
              'Hybrid'
            ]
            results.forEach(function (pick) {
              var tmpMaps = []
              var orderMaps = []
              pick.maps.forEach(function (map, index) {
                map.mapType = mapTypes[index]
                tmpMaps.push(map)
              })
              orderMaps = [
                tmpMaps[0],
                tmpMaps[1],
                tmpMaps[2],
                tmpMaps[3]
              ]
              pick.maps = orderMaps
              tmpPicks.push(pick)
            })
            _this.leaguePicks = tmpPicks
          } else console.log(results)
        })
      })
    },
    getMatchData: function () {
      var _this = this
      fireMatch.getLeagueMatches(this.leagueData.competitionId).then(function (matches) {
        if (matches) {
          matches = _this.sortMatchups(matches)
          var syncPicks = []
          matches.forEach(function (match) {
            syncPicks.push(match.id)
            match.homeLogoUrl = '' // set because of race condition with async and vue render
            match.awayLogoUrl = ''
            match.hasPick = true
            match.pickId = 0
            match.homeLogoUrl = fireImage.getLocalTeamLogo(match.homeTeamLogo)
            match.awayLogoUrl = fireImage.getLocalTeamLogo(match.awayTeamLogo)
            if (_this.user) {
              var checkData = {
                leagueId: _this.leagueId,
                matchId: match.id,
                userId: _this.user.uid
              }
              firePick.checkExisting(checkData).then(function (result) {
                if (result) {
                  match.hasPick = true
                  match.pickId = result
                } else match.hasPick = false
              })
            }
          })
          _this.$store.dispatch('savePicks', syncPicks)
          _this.matchups = matches
        }
      })
    },
    getOldMatchData: function () {
      var _this = this
      fireMatch.getOldLeagueMatches(this.leagueData.competitionId).then(function (matches) {
        if (matches) {
          matches = _this.sortMatchups(matches)
          matches.forEach(function (match) {
            match.homeLogoUrl = '' // set because of race condition with async and vue render
            match.awayLogoUrl = ''
            match.hasPick = true
            match.pickId = 0
            fireImage.getTeamLogo(match.homeTeamLogo).then(function (url) {
              match.homeLogoUrl = url
            })
            fireImage.getTeamLogo(match.awayTeamLogo).then(function (url) {
              match.awayLogoUrl = url
            })
          })
          _this.oldMatchups = matches
        }
      })
    },
    sortMatchups: function (matchups) {
      var sorted = matchups.slice(0)
      return sorted.sort(function (a, b) { return (a.startDate > b.startDate) ? 1 : ((b.startDate > a.startDate) ? -1 : 0) })
    },
    getTeams: function () {
      // get teams to get winner chosen (tmp)
      var _this = this
      if (this.leagueData) {
        fireTeam.getTeams(this.leagueData.competitionId).then(function (teams) {
          _this.teams = teams
        })
      }
    }
  },
  computed: {
    streamChatLink: function () {
      return '/#/StreamChat/' + this.leagueId
    },
    leagueMode: function () {
      if (this.leagueData.simpleMode) return 'Simple Picks'
      else return 'Standard Picks'
    },
    leagueUrl: function () {
      return 'https://highnoonpickem.com/#/ViewLeague/' + this.leagueId
    },
    maxUsers: function () {
      if (this.leagueData) {
        return this.leagueUsers.length >= this.leagueData.maxUsers
      }
    },
    userData: function () {
      return this.$store.getters.getUserData
    },
    currentStage: function () {
      return this.$store.getters.currentStage
    },
    isAdmin: function () {
      return this.userData.isAdmin
    },
    canJoinLeague: function () {
      var _this = this
      if (_this.user && _this.leagueUsers.length) {
        var can = false
        // console.log(JSON.stringify(_this.leagueData))
        if (_this.isOwner) can = false
        if (_this.leagueData) {
          if (_this.leagueUsers.length >= _this.leagueData.maxUsers) {
            can = false
            _this.maxUsers = true
          } else can = true
        }
        if (_this.inLeague) can = false
        if (!_this.verified) can = false
        if (_this.numberLeagues >= 8 && !_this.user.isInnerCircle) can = false
        return can
      } else return false
    }
  },
  mounted: function () {
    var _this = this
    this.leagueId = this.$route.params.leagueId

    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        _this.user = user
        if (!user.emailVerified) _this.verified = false
        else _this.verified = true
        fireLeague.hasLeaguePassword(_this.leagueId).then(function (response) {
          if (response) _this.hasPassword = true
        })
        // get league count
        fireLeague.getLeaguesByUser(user.uid).then(function (leagues) {
          _this.numberLeagues = leagues.length
        })
        // get basic league data
        fireLeague.getLeagueById(_this.leagueId).then(function (data) {
          if (!data.data.simpleMode) data.data.simpleMode = false
          if (!data.data.lotteryMode) data.data.lotteryMode = false
          if (!data.data.motd) data.data.motd = '# Welcome to this league!'
          _this.leagueData = data.data
          if (data.data.ownerId === user.uid) _this.isOwner = true
          _this.getMatchData()
          _this.getOldMatchData()
          _this.getTeams()
          _this.getActiveMatchPick()
        })

        // get the users in the league
        fireLeague.getLeagueUsers(_this.leagueId).then(function (data) {
          data.forEach(function (tmpUser) {
            if (tmpUser.userId === _this.user.uid) _this.inLeague = true
          })
          _this.leagueUsers = data
          _this.getPicks()
        })

        // get the users picks.
      } else {
        _this.$router.push({path: '/Login/' + _this.leagueId})
      }
    })
  }
}
</script>

<style lang="scss" scoped>
  @import '../variables.scss';
  h2 span.button {
    font-family: BlinkMacSystemFont, -apple-system, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  }
  .small-logo {
    height: 2rem;
    width: auto;
  }
  .team-pick-name {
    img {
      height: 4rem;
      width: auto;
      display: inline-block;
      padding: 0 .5rem;
    }
  }
  .user-block {
    border-radius: 4px;
    border: 1px solid #ccc;
  }
  .vs {
    color: $owp-orange;
    font-size: 1.4rem;
    padding: 0 1rem;
  }
</style>
