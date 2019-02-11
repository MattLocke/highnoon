<template lang="pug">
  .scoring-info
    collapsible(title-text="Scoring Info")
      p When building your team, remember that points are based off of eliminations and hitpoints exchanged.  A player that plays more will score better than a single-map player (like Pine) will.
        span(v-if="!league.rawScoring")  If a player plays more than once in a week, they'll only get their best day, not both days.  This is controllable by the league owner.
        span(v-else)  If a player plays more than once in a week, that player WILL SCORE ALL POINTS.  This is controllable by the league owner.
      hr
      .left-bar-item
        span .5 points per elimination
      .left-bar-item
        span 1 point per 1000 damage
      .left-bar-item
        span 1 point per 1000 healing
</template>

<script>
export default {
  name: 'ScoringInfo',
  props: {
    league: {
      type: Object,
      required: true
    }
  }
}
</script>
