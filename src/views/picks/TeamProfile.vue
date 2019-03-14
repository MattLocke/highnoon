<template lang="pug">
  .team-profile
    h2 Players
    .columns.is-multiline
      .column.is-one-third(v-for="player in players")
        player-card(:player="player.player" :primaryColor="team.primaryColor == '000000' ? team.secondaryColor : team.primaryColor")
</template>

<script>
import PlayerCard from '@/components/PlayerCard'

export default {
  components: {
    PlayerCard
  },
  props: {
    team: {
      required: true
    },
    players: {
      required: true,
      default: false
    }
  },
  methods: {
    playerUrl (player) {
      if (player) return `/player/${player.name}`
    }
  }
}
</script>

<style lang="scss">
.team-profile {
  .player-card {
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 4px;
    padding: 4px;
  }
  .player-name, .player-role {
    display: block;
  }
}
</style>
