<template lang="pug">
  .team-profile
    //- h2 Accounts
    //- ul
      li(v-for="account in team.accounts")
        a(:href="account.value") {{ account.accountType }}
    h2 Players
    .columns.is-multiline
      .column.is-one-quarter(v-for="playerObj in players")
        .player-card
          span.player-name
            router-link(:to="playerUrl(playerObj.player)") {{ playerObj.player.name }}
          span.player-role {{ playerObj.player.attributes.role }}
          span.is-proper(v-if="playerObj.player.attributes.heroes") {{ playerObj.player.attributes.heroes[0] }}
          span(v-else) N/A
    //- table.table.is-fullwidth
      thead
        tr
          th Handle
          th Role
          th Most Played Hero
      tbody(v-if="players")
        tr(v-for="playerObj in players")
          td
            router-link(:to="playerUrl(playerObj.player)") {{ playerObj.player.name }}
          td {{ playerObj.player.attributes.role }}
          td.is-proper(v-if="playerObj.player.attributes.heroes") {{ playerObj.player.attributes.heroes[0] }}
          td(v-else) N/A
</template>

<script>
export default {
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
