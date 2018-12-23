<template lang="pug">
  .leagues
    .columns.is-marginless
      left-bar
        section
          h2 Fantasy Leagues
          .left-bar-item(v-if="!fantasyLeagues.length") You currently have no Fantasy leagues.
          .left-bar-item.has-pointer(:class="{'active-item': $route.params.leagueId == league.leagueId}" v-for="league in fantasyLeagues" :key="league.leagueId" @click="setLeague(league.leagueId)") {{ league.leagueName }}
        section
          h2 Create A League
        section
          router-link.button.is-primary(to="/createLeague") Create League
        section
          router-link.button.is-primary(to="/draft") Test Draft
      .column
        .columns
          .column.is-narrow
            | [LEAGUE_IMAGE]
          .column
            h1 Set to the first league
            .social-icons
              span [TWITTER] [INSTAGRAM] [DISCORD]
        section
          h2 League Message
        section
          .columns
            .column.has-text-right
              h2 TEAM AWESOME
              span.team-owner SouldrinK
              .roster
                .ow-font AIMGOD
                .ow-font LINKZR
                .ow-font ARK
                .ow-font MARO
                .ow-font BIGGOOSE
                .ow-font MICKIE
            .column.is-narrow
              span vs
            .column
              h2 TEAM OLD MAN DRINK
              span.team-owner Moosetube
              .roster
                .ow-font FLOW3R
                .ow-font STRIKER
                .ow-font COOLMATT
                .ow-font NEKO
                .ow-font JJONAK
                .ow-font BOOMBOX
</template>

<script>
export default {
  name: 'Leagues',
  computed: {
    userId () {
      return this.$store.getters.getUserId
    },
    userLeagues () {
      return this.$store.getters.getUserLeagues
    },
    leaguesClean () {
      return Object.values(this.userLeagues)
    },
    fantasyLeagues () {
      return this.leaguesClean.filter(league => league.leagueType === 'standard')
    }
  },
  watch: {
    userId: {
      immediate: true,
      handler (val) {
        if (val && val.length) this.$store.dispatch('getLeagues', val)
      }
    }
  },
  methods: {
    setLeague (leagueId) {
      this.$router.push({ path: `/leagues/${leagueId}` })
    }
  }
}
</script>

<style lang="scss">
  .team-owner {
    font-size: .8rem;
    line-height: .6rem;
  }
</style>
