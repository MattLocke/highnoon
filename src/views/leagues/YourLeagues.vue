<template lang="pug">
  section.your-leagues
    collapsible(title-text="Leagues" :start-collapsed="false")
      h3 You are in
        span.orange  {{ userLeagues.length }}
        |  of
        span.orange  8
        |  leagues
      .left-bar-item(v-if="!userLeagues.length") You currently have no Fantasy leagues.
      .left-bar-item.has-pointer(:class="{'active-item': $route.params.leagueId == league.leagueId}" v-for="league in userLeagues" :key="league.leagueId" @click="setLeague(league)")
        .league-title {{ league.leagueName }}
          span.is-pulled-right.ow-font {{ league.leagueType }}
      hr
      router-link.button.is-primary(to="/createLeague" v-if="userData.isAdmin || userData.isAlpha") Create League
</template>

<script>
export default {
  name: 'YourLeagues',
  props: {
    userId: {
      type: String,
      required: true
    }
  },
  computed: {
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
