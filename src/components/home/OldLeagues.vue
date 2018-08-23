<template lang="pug">
  .currentLeague.box
    .wrap(v-if="myLeagues.length")
      h2.overwatch-font.text-border Previous Leagues 
      .myLeagues(v-if="loggedIn")
        a.league-listing.overwatch-font(v-for="league in myLeagues" v-bind:href="leagueUrl(league.leagueId)") 
          h4 {{ league.leagueName }}
      .signIn(v-else)
        p You are not logged in!
    .wrap(v-else)
      h2.overwatch-font.text-border Previous Leagues
      p Your previous leagues will appear here once they've been completed.
</template>

<script>
import fireLeague from '@/services/league'
import firebase from 'firebase'

export default {
  data () {
    return {
      loggedIn: false,
      myLeagues: []
    }
  },
  methods: {
    leagueUrl: function (leagueId) {
      return '/#/ViewLeague/' + leagueId
    }
  },
  mounted: function () {
    var _this = this
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        fireLeague.getOldLeaguesByUser(user.uid).then(function (leagues) {
          _this.myLeagues = leagues
          _this.loggedIn = true
        })
      }
    })
  }
}
</script>

<style lang="scss" scoped>
  @import '../../variables.scss';
  .button {
    display: block;
  }
  .league-listing {
    display: block;
    padding: .4rem .2rem;
    margin: .8rem 0;
    color: $owp-dkblue;
    &:active {
      color: $owp-dkblue;
    }
    &:visited {
      color: $owp-dkblue;
    }
    &:hover {
      background-color: $owp-dkblue;
      color: #fff;
    }
  }
</style>