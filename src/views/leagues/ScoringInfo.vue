<template lang="pug">
  .scoring-info
    collapsible(title-text="Scoring Info")
      p When building your team, remember that points are based off of eliminations and hitpoints exchanged.  A player that plays more will score better than a single-map player (like Pine) will.  If a player plays more than once in a week, they'll only get their best day, not both days.
      hr
      .left-bar-item
        span .5 points per elimination
      .left-bar-item
        span 1 point per 1000 damage
      .left-bar-item
        span 1 point per 1000 healing
</template>
