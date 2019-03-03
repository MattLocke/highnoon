<template lang="pug">
  .gig
    h1.orange GIG STATS

</template>

<script>
/*
  So for additional non-premium stats:
  X 1. Live Draft pick %
  2. Number of leagues (Standard and Unlimited) where player is currently on bench
  3. Number of leagues (Standard and Unlimited) where player is currently on roster

  And for premium stats:
  1. Elims
  2. Damage
  3. Healing
  4. Matches Played
  5. Time Played
  6. Free Agent %
  7. Times traded
  8. Hero playtime
*/
export default {
  name: 'StatsForGig',
  computed: {
    players () {
      return this.$store.getters.getPlayers
    },
    playerScores () {
      return this.$store.getters.getPlayerScores
    },
    playerTotalScores () {
      return this.$store.getters.getPlayerTotalScores
    }
  }
}
</script>
