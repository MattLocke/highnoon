<template lang="pug">
  .createleague
    section.section
      .container
        .box
          h1.text-border Create A League
          p Create a new league using the form below.  For now, you are limited to participating in 5 leagues, and 25 members per league.
        .box
          h2.text-border Step 1. Choose a Competition
          p Choose a competition to base the league off of.  Keep in mind you can have multiple leagues, so you can always create another one for the other competitions.  For this alpha, there will only be Overwatch League.
          .columns
            .column(v-for="comp in competitions")
              .comp-wrapper
                a(:href="comp.winstonUrl" target="_blank")
                  img.compImage(v-bind:src="comp.fireImage")
                h4.overwatch-font {{ comp.name }}
                p {{ comp.description }}
                button.button.negative-button(v-if="comp.id === leagueInfo.competitionId") Chosen!
                button.button.positive-button(v-else v-on:click="chooseComp(comp.id, comp.name)") Choose This League
        .box
          h2.text-border Step 2. Name Your League
          p This is the name your league will show up as when others are invited/join!
          input.input.is-large(v-model="leagueInfo.name" type="text")
        .box
          h2.text-border Step 3. Simple Mode
          p Sometimes you just want to pick who's gonna win and what the score is going to be.  This is the option for you.  This removes map scoring to keep things simple!
          input#simplemode.tgl.tgl-flip(type = "checkbox" v-model="leagueInfo.simpleMode" value="true")
          label.tgl-btn(data-tg-off = "Normal", data-tg-on = "Simple", for = "simplemode")
        .box
          h2.text-border Step 4. Confirm and Create
          p Make sure everything is the way you like it, then finalize it!
          button.button.positive-button(v-on:click="createLeague()" v-if="formCompleted" v-bind:class="{'is-loading': isLoading}") Create My League
</template>

<script>
import firebase from 'firebase'
import fireLeague from '@/services/league'
import fireUser from '@/services/user'
import fireComp from '@/services/competition'

export default {
  name: 'createleague',
  data () {
    return {
      isLoading: false,
      competitions: [],
      leagueInfo: {
        simpleMode: false,
        competitionId: null,
        competitionName: '',
        name: '',
        isPublic: false,
        isLocked: false,
        ownerId: null,
        ownerDisplayName: '',
        maxUsers: 25
      }
    }
  },
  computed: {
    formCompleted: function () {
      if (this.leagueInfo.competitionId && this.leagueInfo.name && this.leagueInfo.ownerId) return true
      else return false
    },
    sortedComps: function () {
      return this.competitions.sort((a, b) => a.startDate < b.startDate)
    }
  },
  methods: {
    chooseComp: function (id, name) {
      this.leagueInfo.competitionId = id
      this.leagueInfo.competitionName = name
    },
    createLeague: function () {
      this.isLoading = true
      fireLeague.createLeague(this.leagueInfo, this.$router)
    }
  },
  mounted: function () {
    var _this = this // set this to maintain references inside firebase functions

    // snag the competition info from the database (need to move to service)
    fireComp.getCompetitions().then(function (competitions) {
      _this.competitions = competitions
    })

    // get the user information and populate the owner for league info.
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        if (!user.emailVerified) _this.$router.push({path: '/'})
        _this.leagueInfo.ownerId = user.uid
        fireLeague.getLeaguesByUser(user.uid).then(function (leagues) {
          if (leagues.length > 8) _this.$router.push({path: '/Home'})
        })
        // Now get their name for the sake of my sanity
        fireUser.getProfile(user.uid).then(function (userData) {
          if (userData) _this.leagueInfo.ownerDisplayName = userData.displayName
          else _this.leagueInfo.ownerDisplayName = 'None'
        })
      } else {
        // No user is signed in!  WTF!  Redirect them to home.  :)
      }
    })
  }
}
</script>

<style lang="scss" scoped>
  .compImage {
    height: 250px; width: auto;
  }
  .comp-wrapper {
    text-align: center;
    .button {
      display: block;
      margin: 0 auto;
    }
  }
</style>
