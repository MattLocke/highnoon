<template lang="pug">
  .league-leaderboards
    h2 Current Standings
    .choose-board
      a.overwatch-font(v-on:click="showTab(0)" v-bind:class="{'is-active':leaderTab === 0}") Overall
      a.overwatch-font(v-on:click="showTab(5)" v-bind:class="{'is-active':leaderTab === 5}" v-if="playoffsTotal") Playoffs
      a.overwatch-font(v-on:click="showTab(4)" v-bind:class="{'is-active':leaderTab === 4}" v-if="stage4Total") Stage 4
      a.overwatch-font(v-on:click="showTab(3)" v-bind:class="{'is-active':leaderTab === 3}" v-if="stage3Total") Stage 3
      a.overwatch-font(v-on:click="showTab(2)" v-bind:class="{'is-active':leaderTab === 2}" v-if="stage2Total") Stage 2
      a.overwatch-font(v-on:click="showTab(1)" v-bind:class="{'is-active':leaderTab === 1}" v-if="stage1Total") Stage 1
      a.overwatch-font(v-on:click="showTab(9)" v-bind:class="{'is-active':leaderTab === 9}" v-if="leagueData.lotteryMode") Lottery
    .leaderboard-wrap(v-if="leaderTab === 9")
      table.table.is-fullwidth.is-striped.owp-orange-border
        thead
          tr
            th #
            th User
            th Tickets
        tbody
          tr(v-for="(user, index) in leagueUsers")
            td {{ index + 1 }}
            td {{ user.userDisplayName }}
            td {{ Math.floor(Math.random() * 1000) + 250 }}
    .leaderboard-wrap(v-if="leaderTab === 5 && playoffsTotal")
      leaderboardTable(:theUsers="leagueUsers" stage="Playoffs")
    .leaderboard-wrap(v-if="leaderTab === 4 && stage4Total")
      leaderboardTable(:theUsers="leagueUsers" stage="4")
    .leaderboard-wrap(v-if="leaderTab === 3 && stage3Total")
      leaderboardTable(:theUsers="leagueUsers" stage="3")
    .leaderboard-wrap(v-if="leaderTab === 2 && stage2Total")
      leaderboardTable(:theUsers="leagueUsers" stage="2")
    .leaderboard-wrap(v-if="leaderTab === 1 && stage1Total")
      leaderboardTable(:theUsers="leagueUsers" stage="1")
    .leaderboard-wrap(v-if="leaderTab === 0")
      leaderboardTable(:theUsers="leagueUsers" stage="0")
</template>

<script>
  import leaderboardTable from '@/components/league/leagueLeaderboardTable'

  export default {
    name: 'league-leaderboards',
    props: [
      'leagueUsers',
      'leagueData'
    ],
    components: {
      leaderboardTable
    },
    data () {
      return {
        paginate: ['leagueLeaderboardUsers'],
        leaderTab: 0
      }
    },
    computed: {
      stage1Total: function () {
        var total = 0
        if (this.leagueUsers) {
          this.leagueUsers.forEach(function (user) {
            if (user.stage1Points) total += user.stage1Points
          })
        }
        return Number(total)
      },
      stage2Total: function () {
        var total = 0
        if (this.leagueUsers) {
          this.leagueUsers.forEach(function (user) {
            if (user.stage2Points) total += user.stage2Points
          })
        }
        return Number(total)
      },
      stage3Total: function () {
        var total = 0
        if (this.leagueUsers) {
          this.leagueUsers.forEach(function (user) {
            if (user.stage3Points) total += user.stage3Points
          })
        }
        return Number(total)
      },
      stage4Total: function () {
        var total = 0
        if (this.leagueUsers) {
          this.leagueUsers.forEach(function (user) {
            if (user.stage4Points) total += user.stage4Points
          })
        }
        return Number(total)
      },
      playoffsTotal: function () {
        var total = 0
        if (this.leagueUsers) {
          this.leagueUsers.forEach(function (user) {
            if (user.playoffPoints) total += user.playoffPoints
          })
        }
        return Number(total)
      }
    },
    methods: {
      showTab: function (num) {
        this.leaderTab = num
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../variables.scss';
  .choose-board a {
    display: inline-block;
    padding: .4rem 3rem;
    background-color: $owp-orange;
    color: #fff;
    font-size: 1.3rem;
    &.is-active {
      background-color: $owp-dkblue;
    }
  }
</style>