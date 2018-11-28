<template lang="pug">
  .create-league
    .container(v-if="numLeagues < 4")
      section(v-if="!typeChosen")
        h1 Create League
        p Choose a league type below to get started.
      .columns(v-if="!typeChosen")
        .column.is-half-desktop
          section
            h2 Pick'Em
            p You and an UNLIMITED number of friends/peers pick who will win each week, and prizes may be awarded by tickets or points.
            hr
            button.button.is-primary(@click="choosePickem()") Choose Pick'Em
        .column.is-half-desktop
          section
            h2 Traditional Fantasy
            p You and up to 11 other buddies will form teams in a draft-like fashion, and will duke it out each week.  Points and record will be available for leaderboards.
            hr
            button.button.is-primary(@click="chooseFantasy()") Choose Fantasy
      pickem(v-if="showPickem" @complete="createLeague()" @cancel="resetChoice")
      fantasy(v-if="showFantasy" @complete="createLeague()" @cancel="resetChoice")
    .box(v-else)
      .container
        section
          p I'm sorry, looks like you're all out of leagues!  Feel free to
            a(href="#")  support me through patreon
            |  to have unlimited leagues!
</template>

<script>
import Pickem from '@/views/createLeague/Pickem'
import Fantasy from '@/views/createLeague/Fantasy'

export default {
  components: {
    Pickem,
    Fantasy
  },
  data () {
    return {
      showPickem: false,
      showFantasy: false,
      leagueData: {}
    }
  },
  computed: {
    numLeagues () {
      return 0
    },
    typeChosen () {
      return this.showPickem || this.showFantasy
    }
  },
  methods: {
    choosePickem () {
      this.showPickem = true
      this.showFantasy = false
    },
    chooseFantasy () {
      this.showPickem = false
      this.showFantasy = true
    },
    createLeague () {
      // Create the league based on showPickem value
    },
    resetChoice () {
      this.showPickem = false
      this.showFantasy = false
    }
  }
}
</script>
