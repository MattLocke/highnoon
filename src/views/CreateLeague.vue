<template lang="pug">
  .create-league
    .container(v-if="numLeagues < 4")
      h1 Create A New League
      section(v-show="!league.leagueType")
        .columns
          .column
            h2 Standard
            img.img(src="/images/league-standard.jpg" alt="standard league icon")
            p You and up to 11 other buddies can get together and draft teams to compete against one another!  Each week you'll be matched against a new opponent and best record at the end wins!
            .has-text-centered
              button.button.is-primary(@click="league.leagueType = 'standard'") Choose Standard
          .column
            h2 Unlimited
            img.img(src="/images/league-unlimited.jpg" alt="unlimited league icon")
            p Unlimited league sizes.  No roster restrictions.  Build your perfect team and see how well you score.  No head to head matchup, instead the points each week will be used for leaderboards.
            .has-text-centered
              //- button.button.is-primary(@click="league.leagueType = 'unlimited'") Choose Unlimited
              button.button.is-primary(disabled) Choose Unlimited
          .column
            h2 Pick 'em
            img.img(src="/images/league-pickem.jpg" alt="pickem league icon")
            p Each week choose which team will win each of the matchups.  This is more simple than we offered in Season 1 due to the overhead running full-fledged fantasy leagues brings to the table!
            .has-text-centered
              //- button.button.is-primary(@click="league.leagueType = 'pickem'") Choose Pick'Em
              button.button.is-primary(disabled) Choose Pick'Em
      section(v-show="league.leagueType")
        .columns
          .column
            h2 {{ league.leagueType }} League
          .column.is-narrow
            button.button.is-primary.is-small(@click="league.leagueType = ''") Change League Type
      section(v-if="league.leagueType")
        .columns
          .column.is-three-quarters-desktop
            b-field(label="League Name")
              b-input(placeholder="league name" v-model="league.leagueName")
          .column
            b-field(label="Password (optional)")
              b-input(placeholder="password" v-model="league.password")
      section(v-if="league.leagueType == 'standard'")
        .columns
          .column
            b-field(label="Role Requirements")
              b-select(v-model="requiredRoles")
                option(value=2) 2/2/2/x
                option(value=1) 1/1/1/x
                option(value=0) x/x/x/x
          .column
            .has-text-centered
              label.label Offense
              span.big-number {{ league.requiredOffense }}
              span.micro minimum
          .column
            .has-text-centered
              label.label Support
              span.big-number {{ league.requiredSupport }}
              span.micro minimum
          .column
            .has-text-centered
              label.label Tank
              span.big-number {{ league.requiredTank }}
              span.micro minimum
          .column
            .has-text-centered
              label.label Flex
              span.big-number {{ league.requiredFlex }}
              span.micro minimum
      section(v-if="league.leagueType")
        button.button.is-primary(@click="createLeague" v-if="canCreateLeague") Create League
        button.button.is-primary(disabled v-else) Create League
    .box(v-else)
      .container
        section
          p I'm sorry, looks like you're all out of leagues!  Feel free to
            a(href="#")  support me through patreon
            |  to have unlimited leagues!
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'
import { fireInit } from '@/fireLogin'

import LeagueService from '@/services/league'

export default {
  name: 'CreateLeague',
  data () {
    return {
      league: {
        leagueName: null,
        leagueImageUrl: null,
        leagueType: null,
        password: null,
        passwordProtected: false,
        discord: null,
        instagram: null,
        reddit: null,
        twitter: null,
        requiredOffense: 2,
        requiredSupport: 2,
        requiredTank: 2,
        requiredFlex: 0,
        status: 'unDrafted'
      },
      requiredRoles: 2
    }
  },
  computed: {
    numLeagues () {
      return 0
    },
    ownerId () {
      return this.$store.getters.getUserId
    },
    canCreateLeague () {
      return this.league.leagueName
    },
    userData () {
      return this.$store.getters.getUserData
    }
  },
  watch: {
    requiredRoles: {
      immediate: true,
      handler (val) {
        switch (Number(val)) {
          case 2:
            this.league.requiredOffense = 2
            this.league.requiredSupport = 2
            this.league.requiredTank = 2
            break
          case 1:
            this.league.requiredOffense = 1
            this.league.requiredSupport = 1
            this.league.requiredTank = 1
            break
          case 0:
          default:
            this.league.requiredOffense = 0
            this.league.requiredSupport = 0
            this.league.requiredTank = 0
        }
      }
    },
    'league.password': {
      handler (val) {
        if (val.length > 0) this.league.passwordProtected = true
        else this.league.passwordProtected = false
      }
    }
  },
  mounted () {
    fireInit()
  },
  methods: {
    createLeague () {
      const leagueData = {
        ...this.league,
        ownerId: this.ownerId
      }

      const db = firebase.database()

      this.$store.dispatch('setLoading', true)
      LeagueService.createLeague(this.userData, leagueData)
        .then((leagueId) => {
          db.ref(`/draftStatus/${leagueId}`).set('unDrafted')
          this.$store.dispatch('setLoading', false)
          if (leagueId) this.$router.push({ path: `/leagues/${leagueId}` })
        })
        .catch(() => {
          this.$store.dispatch('setLoading', false)
          // some kind of error message here as well.
        })
    }
  }
}
</script>

<style lang="scss">
.create-league {
  p {
    margin-bottom: 1rem;
  }
  .is-max-height {
    height: 100%;
  }
  .micro {
    font-size: .6rem;
    display: block;
  }
}
</style>
