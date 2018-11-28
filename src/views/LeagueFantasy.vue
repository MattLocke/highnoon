<template lang="pug">
  .league-fantasy
    .columns
      left-bar
        h1 League View for Fantasy
        delete-league
        invite-link
        league-image
        ledger
        lock-league
        password-protect
        remove-user
      .column
        .container
          section
            h1 Fantasy League Name Goes Here
          section(v-if="showAutocomplete")
            p Type a player name below to add them to your roster.
            input.input.find-player(
              type="text"
              placeholder="Type Player Name"
              v-model="filterText")
            .results(v-show="filterText.length")
              .result-item(
                v-for="(player, index) in filteredPlayers"
                :key="player.name"
                v-if="index < 5"
                @click="setPlayer(index)")
                .columns.is-mobile
                  .column.is-one-third
                    span {{ player.name }}
                  .column.is-one-third
                    span {{ player.team }}
                  .column.is-one-third
                    span {{ player.attributes.role }}
          section(v-if="selectedPlayers.length")
            button.button.is-primary.is-small.is-pulled-right(@click="showAllStats = !showAllStats") Toggle Stats
            h2 Selected Players ({{ selectedPlayers.length }} of {{ maxPlayers }})
            hr
            .columns.is-multiline.is-mobile
              .column.is-one-fifth-desktop.is-one-third-mobile(v-for="(player, index) in selectedPlayers" :key="player.name")
                player-card(:player="player" :showStats="showAllStats" @remove="removePlayer(index)")
          section.has-text-centered
            button.button.is-primary Save Roster
</template>

<script>
import playerService from '@/services/players'

import PlayerCard from '@/components/PlayerCard'
import DeleteLeague from '@/views/pickem/DeleteLeague'
import InviteLink from '@/views/pickem/InviteLink'
import LeagueImage from '@/views/pickem/LeagueImage'
import Ledger from '@/views/pickem/Ledger'
import LockLeague from '@/views/pickem/LockLeague'
import PasswordProtect from '@/views/pickem/PasswordProtect'
import RemoveUser from '@/views/pickem/RemoveUser'

export default {
  name: 'FantasyLeague',
  components: {
    DeleteLeague,
    InviteLink,
    LeagueImage,
    Ledger,
    LockLeague,
    PasswordProtect,
    RemoveUser,
    PlayerCard
  },
  data () {
    return {
      players: [],
      currentPage: 1,
      filterText: '',
      selectedPlayer: null,
      selectedPlayers: [],
      isLoaded: false,
      maxPlayers: 8,
      showAllStats: false
    }
  },
  computed: {
    filteredPlayers () {
      return this.players.filter(player => player.name.toLowerCase().includes(this.filterText.toLowerCase()))
    },
    showAutocomplete () {
      return this.players.length && this.isLoaded && this.selectedPlayers.length < this.maxPlayers
    }
  },
  mounted () {
    playerService.getAllPlayers()
      .then(players => {
        this.isLoaded = true
        this.players = players
      })
  },
  methods: {
    setPlayer (index) {
      const exists = this.selectedPlayers.findIndex(x => x.name === this.filteredPlayers[index].name)

      if (exists === -1 && this.selectedPlayers.length < this.maxPlayers) {
        this.selectedPlayers.push(this.filteredPlayers[index])
        this.filterText = ''
      }
    },
    removePlayer (index) {
      this.selectedPlayers.splice(index, 1)
    }
  }
}
</script>

<style lang="scss">
  .results {
    position: absolute;
    .result-item {
      position: relative;
      z-index: 800;
      cursor: pointer;
      &:hover {
        color: #f80;
      }
      background-color: #30375f;
      padding: .25rem 1rem;
      min-width: 30vw;
    }
  }
  .find-player {
    position: relative;
  }
</style>
