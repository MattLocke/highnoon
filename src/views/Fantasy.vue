<template lang="pug">
  .fantasy
    .wrap
      .box
        h1 Fantasy
        table.table.is-fullwidth
          thead
            tr
              th Name
              th Number
              th Role
              th Team
          tbody
            tr(v-for="player in players" :key="player.name")
              td {{ player.name }}
              td {{ player.attributes.player_number }}
              td {{ player.attributes.role }}
              td {{ player.team }}
</template>

<script>
import playerService from '@/services/players'

export default {
  name: 'fantasy',
  data () {
    return {
      players: []
    }
  },
  mounted () {
    playerService.getAllPlayers()
      .then(players => {
        this.players = players
      })
  }
}
</script>
