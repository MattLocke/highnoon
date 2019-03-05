<template lang="pug">
  .league-schedule-week
    h3(:class="{'orange': currentWeek === week}") Week {{ index }}
    div(v-for="match in week")
      span(:class="{'orange': match.home.userId == userId}") {{ match.home.displayName }}
      span  vs
      span(:class="{'orange': match.away.userId == userId}")  {{ match.away.displayName }}
    div
      router-link.button.is-primary.is-small(v-if="Number(index) <= Number(currentWeek)" :to="`/leagueMatchups/${leagueId}/${index}`") See Matchups
</template>

<script>
export default {
  props: {
    index: {
      type: [Number, String],
      required: true
    },
    week: {
      type: Array,
      required: true
    },
    currentWeek: {
      type: [Number, String],
      required: true
    }
  },
  computed: {
    leagueId () {
      return this.$route.params.leagueId
    },
    userId () {
      return this.$store.getters.getUserId
    }
  }
}
</script>
