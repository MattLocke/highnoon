<template lang="pug">
  .leaderboard
    .choose-stage
      select.select.is-pulled-right(v-model="leaderStage")
        option(value="Combined") Combined
        option(value="Stage 1") Stage 1
        option(value="Stage 2") Stage 2
        option(value="Stage 3") Stage 3
        option(value="Stage 4") Stage 4
        option(value="Playoffs") Playoffs
    .is-clearfix.is-hidden-desktop.select-buffer
    .choose-board
      a.overwatch-font(v-on:click="showNormal()" v-bind:class="{'is-active':normalActive}") Standard
      a.overwatch-font(v-on:click="showSimple()" v-bind:class="{'is-active':simpleActive}") Simple
    .leaders(v-if="simpleActive")
      table.table.is-fullwidth.is-striped.owp-orange-border
        thead
          tr
            th #
            th Player
            th Points
            th(v-if="showLeagueNames") League
        tbody(v-if="simpleLoading")
          tr
            td(colspan="4") Loading...
        tbody
          tr(v-for="(team, index) in simpleActiveUsers" v-if="team.points" v-bind:class="{'matchesUser': team.userId === userId}")
            td.position {{ index + 1 }}
            td {{ team.userDisplayName }}
            td {{ team.points }}
            td(v-if="showLeagueNames") {{ team.leagueName }}
          tr.matchesUser(v-if="currentUserSimpleActive")
            td.position {{ currentUserSimple.rank }}
            td {{ currentUserSimple.userDisplayName }}
            td(v-if="leaderStage == 'Stage 1'") {{ currentUserSimpleStage1.points }}
            td(v-else-if="leaderStage == 'Stage 2'") {{ currentUserSimpleStage2.points }}
            td(v-else-if="leaderStage == 'Stage 3'") {{ currentUserSimpleStage3.points }}
            td(v-else-if="leaderStage == 'Stage 4'") {{ currentUserSimpleStage4.points }}
            td(v-else-if="leaderStage == 'Playoffs'") {{ currentUserSimplePlayoffs.points }}
            td(v-else="leaderStage == 'Combined'") {{ currentUserSimple.points }}
            td(v-if="showLeagueNames") {{ currentUserSimple.leagueName }}
    .leaders(v-if="normalActive")
      table.table.is-fullwidth.is-striped.owp-orange-border
        thead
          tr
            th #
            th Player
            th Points
            th(v-if="showLeagueNames") League
        tbody(v-if="normalLoading")
          tr
            td(colspan="4") Loading...
        tbody
          tr(v-for="(team, index) in normalActiveUsers" v-if="team.points" v-bind:class="{'matchesUser': team.userId === userId}")
            td.position {{ index + 1 }}
            td {{ team.userDisplayName }}
            td {{ team.points }}
            td(v-if="showLeagueNames") {{ team.leagueName }}
          tr.matchesUser(v-if="currentUserStandardActive")
            td.position {{ currentUserStandard.rank }}
            td {{ currentUserStandard.userDisplayName }}
            td(v-if="leaderStage == 'Stage 1'") {{ currentUserStandardStage1.points }}
            td(v-else-if="leaderStage == 'Stage 2'") {{ currentUserStandardStage2.points }}
            td(v-else-if="leaderStage == 'Stage 3'") {{ currentUserStandardStage3.points }}
            td(v-else-if="leaderStage == 'Stage 4'") {{ currentUserStandardStage4.points }}
            td(v-else-if="leaderStage == 'Playoffs'") {{ currentUserStandardPlayoffs.points }}
            td(v-else="leaderStage == 'Combined'") {{ currentUserStandard.points }}
            td(v-if="showLeagueNames") {{ currentUserStandard.leagueName }}
</template>

<script>
  // import fireComp from '@/services/competition'
  import fireLeaderboard from '@/services/leaderboard'

  export default {
    name: 'leaderboard',
    props: ['compId'],
    data () {
      return {
        simpleUsers: [],
        simpleUsersStage1: [],
        simpleUsersStage2: [],
        simpleUsersStage3: [],
        simpleUsersStage4: [],
        simpleUsersPlayoffs: [],
        normalUsers: [],
        normalUsersStage1: [],
        normalUsersStage2: [],
        normalUsersStage3: [],
        normalUsersStage4: [],
        normalUsersPlayoffs: [],
        simpleActive: false,
        normalActive: true,
        simpleLoading: true,
        normalLoading: true,
        currentUserSimple: {},
        currentUserSimpleStage1: {},
        currentUserSimpleStage2: {},
        currentUserSimpleStage3: {},
        currentUserSimpleStage4: {},
        currentUserSimplePlayoffs: {},
        currentUserStandard: {},
        currentUserStandardStage1: {},
        currentUserStandardStage2: {},
        currentUserStandardStage3: {},
        currentUserStandardStage4: {},
        currentUserStandardPlayoffs: {},
        leaderStage: 'Combined',
        userId: ''
      }
    },
    computed: {
      showLeagueNames: function () {
        return window.screen.width > 768
      },
      userData: function () {
        return this.$store.getters.getUserData
      },
      currentUserSimpleActive: function () {
        var data = []
        switch (this.leaderStage) {
          case 'Combined':
            data = this.currentUserSimple
            break
          case 'Stage 1':
            data = this.currentUserSimpleStage1
            break
          case 'Stage 2':
            data = this.currentUserSimpleStage2
            break
          case 'Stage 3':
            data = this.currentUserSimpleStage3
            break
          case 'Stage 4':
            data = this.currentUserSimpleStage4
            break
          case 'Playoffs':
            data = this.currentUserSimplePlayoffs
            break
          default:
            data = this.currentUserSimple
            break
        }
        return data
      },
      currentUserStandardActive: function () {
        var data = []
        switch (this.leaderStage) {
          case 'Combined':
            data = this.currentUserStandard
            break
          case 'Stage 1':
            data = this.currentUserStandardStage1
            break
          case 'Stage 2':
            data = this.currentUserStandardStage2
            break
          case 'Stage 3':
            data = this.currentUserStandardStage3
            break
          case 'Stage 4':
            data = this.currentUserStandardStage4
            break
          case 'Playoffs':
            data = this.currentUserStandardPlayoffs
            break
          default:
            data = this.currentUserStandard
            break
        }
        return data
      },
      normalActiveUsers: function () {
        var data = []
        switch (this.leaderStage) {
          case 'Combined':
            data = this.normalUsers
            break
          case 'Stage 1':
            data = this.normalUsersStage1
            break
          case 'Stage 2':
            data = this.normalUsersStage2
            break
          case 'Stage 3':
            data = this.normalUsersStage3
            break
          case 'Stage 4':
            data = this.normalUsersStage4
            break
          case 'Playoffs':
            data = this.normalUsersPlayoffs
            break
          default:
            data = this.normalUsers
            break
        }
        return data
      },
      simpleActiveUsers: function () {
        var data = []
        switch (this.leaderStage) {
          case 'Combined':
            data = this.simpleUsers
            break
          case 'Stage 1':
            data = this.simpleUsersStage1
            break
          case 'Stage 2':
            data = this.simpleUsersStage2
            break
          case 'Stage 3':
            data = this.simpleUsersStage3
            break
          case 'Stage 4':
            data = this.simpleUsersStage4
            break
          case 'Playoffs':
            data = this.simpleUsersPlayoffs
            break
          default:
            data = this.simpleUsers
            break
        }
        return data
      }
    },
    methods: {
      showSimple: function () {
        if (this.simpleLoading) this.getSimpleUsers()
        this.simpleActive = true
        this.normalActive = false
      },
      showNormal: function () {
        this.simpleActive = false
        this.normalActive = true
      },
      getSimpleUsers: function () {
        var _this = this
        fireLeaderboard.leaderboardSimple().then(function (users) {
          _this.simpleUsers = users
          _this.simpleLoading = false
        })
        fireLeaderboard.getLeaderboard('leaderboardSimpleStage1', 100).then(function (users) {
          _this.simpleUsersStage1 = users
        })
        fireLeaderboard.getLeaderboard('leaderboardSimpleStage2', 100).then(function (users) {
          _this.simpleUsersStage2 = users
        })
        fireLeaderboard.getLeaderboard('leaderboardSimpleStage3', 100).then(function (users) {
          _this.simpleUsersStage3 = users
        })
        fireLeaderboard.getLeaderboard('leaderboardSimpleStage4', 100).then(function (users) {
          _this.simpleUsersStage4 = users
        })
        fireLeaderboard.getLeaderboard('leaderboardSimplePlayoffs', 100).then(function (users) {
          _this.simpleUsersPlayoffs = users
        })
      },
      getNormalUsers: function () {
        var _this = this
        fireLeaderboard.leaderboardStandard().then(function (users) {
          _this.normalUsers = users
          _this.normalLoading = false
        })
        fireLeaderboard.getLeaderboard('leaderboardStandardStage1', 100).then(function (users) {
          _this.normalUsersStage1 = users
        })
        fireLeaderboard.getLeaderboard('leaderboardStandardStage2', 100).then(function (users) {
          _this.normalUsersStage2 = users
        })
        fireLeaderboard.getLeaderboard('leaderboardStandardStage3', 100).then(function (users) {
          _this.normalUsersStage3 = users
        })
        fireLeaderboard.getLeaderboard('leaderboardStandardStage4', 100).then(function (users) {
          _this.normalUsersStage4 = users
        })
        fireLeaderboard.getLeaderboard('leaderboardStandardPlayoffs', 100).then(function (users) {
          _this.normalUsersPlayoffs = users
        })
      },
      getCurrentUser: function () {
        var _this = this
        var userId = this.$store.getters.getUserId
        if (userId) {
          fireLeaderboard.leaderboardByUser(userId, 'leaderboardStandard').then(function (user) {
            if (user) _this.currentUserStandard = user
          })
          fireLeaderboard.leaderboardByUser(userId, 'leaderboardSimple').then(function (user) {
            if (user) _this.currentUserSimple = user
          })
        }
      }
    },
    mounted: function () {
      var _this = this
      this.getNormalUsers()
      var userId = this.$store.getters.getUserId || this.$localStorage.get('hnpId')
      _this.userId = userId
      if (userId) {
        fireLeaderboard.leaderboardByUser(userId, 'leaderboardStandard').then(function (user) {
          _this.currentUserStandard = user
        })
        fireLeaderboard.leaderboardByUser(userId, 'leaderboardStandardStage1').then(function (user) {
          _this.currentUserStandardStage1 = user
        })
        fireLeaderboard.leaderboardByUser(userId, 'leaderboardStandardStage2').then(function (user) {
          _this.currentUserStandardStage2 = user
        })
        fireLeaderboard.leaderboardByUser(userId, 'leaderboardStandardStage3').then(function (user) {
          _this.currentUserStandardStage3 = user
        })
        fireLeaderboard.leaderboardByUser(userId, 'leaderboardStandardStage4').then(function (user) {
          _this.currentUserStandardStage4 = user
        })
        fireLeaderboard.leaderboardByUser(userId, 'leaderboardStandardPlayoffs').then(function (user) {
          _this.currentUserStandardPlayoffs = user
        })
        fireLeaderboard.leaderboardByUser(userId, 'leaderboardSimple').then(function (user) {
          _this.currentUserSimple = user
        })
        fireLeaderboard.leaderboardByUser(userId, 'leaderboardSimpleStage1').then(function (user) {
          _this.currentUserSimpleStage1 = user
        })
        fireLeaderboard.leaderboardByUser(userId, 'leaderboardSimpleStage2').then(function (user) {
          _this.currentUserSimpleStage2 = user
        })
        fireLeaderboard.leaderboardByUser(userId, 'leaderboardSimpleStage3').then(function (user) {
          _this.currentUserSimpleStage3 = user
        })
        fireLeaderboard.leaderboardByUser(userId, 'leaderboardSimpleStage4').then(function (user) {
          _this.currentUserSimpleStage4 = user
        })
        fireLeaderboard.leaderboardByUser(userId, 'leaderboardSimplePlayoffs').then(function (user) {
          _this.currentUserSimplePlayoffs = user
        })
      }
    }
  }
</script>

<style lang="scss">
  @import '../../variables.scss';
  .choose-board a {
    display: inline-block;
    padding: .4rem 2rem;
    background-color: $owp-orange;
    color: #fff;
    font-size: 1.3rem;
    &.is-active {
      background-color: $owp-dkblue;
    }
  }
  .select-buffer {
    padding-top: 2.5rem;
  }
  .matchesUser {
    background-color: $owp-orange;
    color: #fff;
  }
  td.matchesUser a {
    color: #fff;
    &:visited, &:hover, &:active {
      color: #fff;
    }
  }
</style>
