<template lang="pug">
  .league-menu.is-hidden-mobile.columns
    .column.is-one-fifth(v-for="league in userLeagues" :key="league.leagueId")
      .ow-font.is-size-5.has-text-centered.league-name {{ league.leagueName }}
</template>

<script>
export default {
  name: 'LeagueMenu',
  data () {
    return {

    }
  },
  computed: {
    userLeagues () {
      return this.$store.getters.getUserLeagues
    }
  }
}
</script>

<style lang="scss">
  .league-menu {
    background-color: rgba(0,0,0,0.8);
    z-index: 999;
    position: fixed;
    bottom: 0;
    width: 100vw;
    padding-bottom: 0!important;
    margin-bottom: 0!important;
    min-height: 5vh;
  }
</style>
