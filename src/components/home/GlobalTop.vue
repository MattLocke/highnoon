<template lang="pug">
  .globalTop
    h1.centered.overwatch-font Global Top 10
    hr
    table.table.is-fullwidth.is-striped.owp-orange-border
      thead
        tr
          th #
          th Player
          th Points
          th(v-if="showLeagueNames") League
      tbody
        tr(v-for="(team, index) in leagueUsers")
          td.position {{ index + 1 }}
          td {{ team.userDisplayName }}
          td {{ team.points }}
          td(v-if="showLeagueNames") {{ team.leagueName }}
    .centered
      a.button.is-large.positive-button(href="/#/Leaderboard") See Leaderboards
</template>

<script>
// import fireComp from '@/services/competition'
import fireLeaderboard from '@/services/leaderboard'

export default {
  name: 'GlobalTop',
  props: ['compId'],
  data () {
    return {
      leagueUsers: [],
      noRepeats: [],
      teamData: []
    }
  },
  computed: {
    showLeagueNames: function () {
      return window.screen.width > 768
    }
  },
  methods: {
    getUsers: function () {
      var _this = this
      fireLeaderboard.homeLeaderboardByCompId('ALI8o0eJ30V1D1Fb7rHV').then(function (users) {
        _this.leagueUsers = users
      })
    }
  },
  mounted: function () {
    this.getUsers()
  }
}
</script>

<style lang="scss" scoped>
  h1 {
    font-size: 4rem;
  }
</style>
