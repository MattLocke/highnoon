<template lang="pug">
  section.your-leagues
    h3 You are in
      span.orange  {{ userLeagues.length }}
      span(v-if="!userData.isAdmin && !userData.isPremier")  of
      span.orange(v-if="!userData.isAdmin && !userData.isPremier")  8
      span  leagues
    div(v-if="!userLeagues.length") You currently have no Fantasy leagues.
    .has-pointer(:class="{'active-item': $route.params.leagueId == league.leagueId}" v-for="league in userLeagues" :key="league.leagueId" @click="setLeague(league)")
      span.ow-font.orange.league-type {{ league.leagueType }}
      .ow-font.is-size-3.league-name {{ league.leagueName }}
    hr
    router-link.button.is-primary(to="/createLeague" v-if="underLeagueLimit") Create League
</template>

<script>
export default {
  name: 'YourLeagues',
  props: {
    userId: {
      type: [String, Number],
      required: true
    }
  },
  computed: {
    underLeagueLimit () {
      return !!(this.userLeagues.length < 9 || this.userData.isPremier || this.userData.isAdmin)
    },
    userData () {
      return this.$store.getters.getUserData
    },
    userLeagues () {
      return this.$store.getters.getUserLeagues
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
    setLeague (league) {
      const leagueNameProper = this.capFirst(league.leagueType)
      this.$router.push({ path: `/League${leagueNameProper}/${league.leagueId}` })
    },
    capFirst (string) {
      return `${string.charAt(0).toUpperCase()}${string.slice(1)}`
    }
  }
}
</script>

<style lang="scss">
  .your-leagues {
    .league-type {
      display: block;
      margin-bottom: -16px;
    }
    .league-name {
      &:hover {
        opacity: 0.6;
      }
    }
  }
</style>
