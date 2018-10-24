<template lang="pug">
  .create-league
    .box(v-if="numLeagues < 4")
      h1 Create League
      hr
      .container
        section(v-if="typeChosen")
          button.button.is-primary(@click="resetChoice()") Cancel
        section(v-else)
          h2 League Type
          hr
          .columns
            .column.is-half-desktop
              .box
                h3 Pick'Em
                p You and an UNLIMITED number of friends/peers pick who will win each week, and prizes may be awarded by tickets or points.
              button.button.is-primary(@click="choosePickem()") Choose Pick'Em
            .column.is-half-desktop
              .box
                h3 Traditional Fantasy
                p You and up to 11 other buddies will form teams in a draft-like fashion, and will duke it out each week.  Points and record will be available for leaderboards.
              button.button.is-primary(@click="chooseFantasy()") Choose Fantasy
        pickem(v-if="showPickem" @complete="createLeague()")
        fantasy(v-if="showFantasy" @complete="createLeague()")
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
