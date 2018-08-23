<template lang="pug">
  .current-leagues.box
    h2.overwatch-font.text-border Your Current Leagues 
      span.orange-text ({{ myLeagues.length }}/8)
    .myLeagues(v-if="loggedIn")

      a.league-listing.overwatch-font(v-for="league in myLeagues" v-bind:href="leagueUrl(league.leagueId)") 
        h4 {{ league.leagueName }}
        span.small.orange-text {{ getMode(league) }}
        span.small  - {{ league.points }} pts
      p(v-if="!myLeagues.length") You currently have no leagues.  Feel free to create your own or pester your friend for their join url or join the discord and someone will let you join one of their leagues!
      a.button.positive-button(href="/#/CreateLeague" v-if="myLeagues.length < 8") Create a League
    .signIn(v-else)
      p You are not logged in!
</template>

<script>
import fireLeague from '@/services/league'
import firebase from 'firebase'

export default {
  name: 'current-leagues',
  data () {
    return {
      loggedIn: false,
      myLeagues: []
    }
  },
  methods: {
    leagueUrl: function (leagueId) {
      return '/#/ViewLeague/' + leagueId
    },
    getMode: function (league) {
      if (league.simpleMode) return 'Simple League'
      else return 'Standard League'
    }
  },
  mounted: function () {
    var _this = this
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        fireLeague.getLeaguesByUser(user.uid).then(function (leagues) {
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
    margin: .4rem 0;
    color: $owp-dkblue;
    .small {
      margin-top: -1rem;
    }
    h4 {
      margin-bottom: -.7rem;
    }
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