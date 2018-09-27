<template lang="pug">
  .team-profile
    //- h2 Accounts
    //- ul
      li(v-for="account in team.accounts")
        a(:href="account.value") {{ account.accountType }}
    h2 Players
    table.table.is-fullwidth
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
