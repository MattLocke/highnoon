<template lang="pug">
  .create-league
    .container(v-if="numLeagues < 4")
      section
        .columns
          .column
            h2 League Name
            b-input(placeholder="league name" v-model="league.leagueName")
          .column.is-narrow
            h2 League Type
            b-select(placeholder="Select a Category" v-model="league.leagueType")
              option player
              option pickem
          .column.is-one-fifth
            p(v-if="league.leagueType == 'player'") Player-base fantasy league.  This is more like traditional fantasy sports.
            p(v-else) Pick'em is where all you do is choose the team you think will win each matchup.
      section
        h2 Password Protect League
        .columns
          .column.is-narrow
            b-switch(v-model="league.passwordProtected")
          .column
            b-input(placeholder="password" v-if="league.passwordProtected" v-model="league.password")
      section
        h2 Social Links
        p Do you or your organization have social media accounts?  Enter their links below!
        .columns.is-multiline
          .column.is-narrow
            b-field(label="Discord")
              b-input(v-model="league.discord")
          .column.is-narrow
            b-field(label="Instagram")
              b-input(v-model="league.instagram")
          .column.is-narrow
            b-field(label="Reddit")
              b-input(v-model="league.reddit")
          .column.is-narrow
            b-field(label="Twitter")
              b-input(v-model="league.twitter")
      section
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
import LeagueService from '@/services/league'

export default {
  name: 'CreateLeague',
  data () {
    return {
      league: {
        leagueName: null,
        leagueImageUrl: null,
        leagueType: 'player',
        password: null,
        passwordProtected: false,
        discord: null,
        instagram: null,
        reddit: null,
        twitter: null
      }
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
    }
  },
  methods: {
    createLeague () {
      const leagueData = {
        ...this.league,
        ownerId: this.ownerId
      }

      this.$store.dispatch('setLoading', true)
      LeagueService.createLeague(leagueData)
        .then((leagueId) => {
          this.$store.dispatch('setLoading', false)
          if (leagueId) this.$router.push({ path: `/ViewLeague/${this.leagueId}` })
          // show an error or something if it no workie.
        })
        .catch(() => {
          this.$store.dispatch('setLoading', false)
          // some kind of error message here as well.
        })
    }
  }
}
</script>
