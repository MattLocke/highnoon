<template lang="pug">
  .league-leaderboards-table
    table.table.is-fullwidth.is-striped.owp-orange-border
      thead
        tr
          th #
          th User
          th Points
      paginate(name="leagueLeaderboardUsers" :list="sortedUsers" :per="per" tag="tbody" ref="leader")
        tr(v-for="(leagueUser, index) in paginated('leagueLeaderboardUsers')")
          td.position {{ place(index) }}
          td(v-bind:class="{'matchesUser': leagueUser.userId === user.id}") 
            a(v-bind:href="profileLink(leagueUser.userId)") {{ leagueUser.userDisplayName }}
          td(v-if="stage == 0 && leagueUser.points >= 0" v-bind:class="{'matchesUser': leagueUser.userId === user.id}") {{ leagueUser.points }}
          td(v-if="stage == 1 && leagueUser.stage1Points >= 0" v-bind:class="{'matchesUser': leagueUser.userId === user.id}") {{ leagueUser.stage1Points || 0 }}
          td(v-if="stage == 2 && leagueUser.stage2Points >= 0" v-bind:class="{'matchesUser': leagueUser.userId === user.id}") {{ leagueUser.stage2Points || 0 }}
          td(v-if="stage == 3 && leagueUser.stage3Points >= 0" v-bind:class="{'matchesUser': leagueUser.userId === user.id}") {{ leagueUser.stage3Points || 0 }}
          td(v-if="stage == 4 && leagueUser.stage4Points >= 0" v-bind:class="{'matchesUser': leagueUser.userId === user.id}") {{ leagueUser.stage4Points || 0 }}
          td(v-if="stage == 'Playoffs' && leagueUser.playoffPoints >= 0" v-bind:class="{'matchesUser': leagueUser.userId === user.id}") {{ leagueUser.playoffPoints || 0 }}
    paginate-links(for="leagueLeaderboardUsers" :hide-single-page="true")
</template>

<script>
  export default {
    name: 'league-leaderboards-table',
    props: [
      'theUsers',
      'stage'
    ],
    computed: {
      user: function () {
        return this.$store.getters.getUserData
      },
      sortedUsers: function () {
        var sourceTmp = this.theUsers
        var source = []
        sourceTmp.forEach(user => {
          if (this.stage === '4') {
            if (user.stage4Points) source.push(user)
          } else source.push(user)
        })
        var returnData = []
        switch (this.stage) {
          case '0':
            returnData = source.sort(function (a, b) { return (a.points < b.points) ? 1 : ((b.points < a.points) ? -1 : 0) })
            break
          case '1':
            returnData = source.sort(function (a, b) { return (a.stage1Points < b.stage1Points) ? 1 : ((b.stage1Points < a.stage1Points) ? -1 : 0) })
            break
          case '2':
            returnData = source.sort(function (a, b) { return (a.stage2Points < b.stage2Points) ? 1 : ((b.stage2Points < a.stage2Points) ? -1 : 0) })
            break
          case '3':
            returnData = source.sort(function (a, b) { return (a.stage3Points < b.stage3Points) ? 1 : ((b.stage3Points < a.stage3Points) ? -1 : 0) })
            break
          case '4':
            returnData = source.sort(function (a, b) { return (a.stage4Points < b.stage4Points) ? 1 : ((b.stage4Points < a.stage4Points) ? -1 : 0) })
            break
          case 'Playoffs':
            returnData = source.sort(function (a, b) { return (a.playoffPoints < b.playoffPoints) ? 1 : ((b.playoffPoints < a.playoffPoints) ? -1 : 0) })
            break
          default:
            returnData = source.sort(function (a, b) { return (a.stage3Points < b.stage3Points) ? 1 : ((b.stage3Points < a.stage3Points) ? -1 : 0) })
            break
        }
        return returnData
      }
    },
    methods: {
      profileLink: function (userId) {
        return '/#/Profile/' + userId
      },
      showStage: function (num) {
        return num === this.stage
      },
      place: function (index) {
        return this.$refs.leader.currentPage * this.per + index + 1
      }
    },
    data () {
      return {
        paginate: ['leagueLeaderboardUsers'],
        per: 25
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../variables.scss';
  .matchesUser {
    background-color: $owp-orange;
    color: #fff;
  }
  td a {
    color: $owp-black;
    &:visited, &:hover, &:active {
      color: $owp-black;
    }
  }
  td.matchesUser a {
    color: #fff;
    &:visited, &:hover, &:active {
      color: #fff;
    }
  }
</style>