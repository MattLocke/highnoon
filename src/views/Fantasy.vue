<template lang="pug">
  .fantasy
    .container
      .box
        h1 OWL Players
        p Just a list of the players in the OWL API.  Can't really do anything here right now, but I figured we'd let you at least see they're there!
        hr
        section
          b-field(label="Filter Players")
            b-input(type="text" v-model="filterText")
        section
          b-table(
            :data="filteredPlayers"
            :paginated="true"
            :per-page="50"
            :current-page.sync="currentPage"
            default-sort="name"
            )
            template(slot-scope="props")
              b-table-column(
                field="name"
                label="Name"
                sortable
              ) {{ props.row.name }}
              b-table-column(
                field="attributes.preferred_slot"
                label="Slot"
                sortable
              ) {{ props.row.attributes.preferred_slot }}
              b-table-column(
                field="attributes.player_number"
                label="Number"
                sortable
              ) {{ props.row.attributes.player_number }}
              b-table-column(
                field="attributes.role"
                label="Role"
                sortable
              ) {{ props.row.attributes.role }}
              b-table-column(
                field="team"
                label="Team"
                sortable
              ) {{ props.row.team }}
</template>

<script>
import playerService from '@/services/players'

import TeamSlot from '@/views/fantasy/TeamSlot'

export default {
  name: 'fantasy',
  components: {
    TeamSlot
  },
  data () {
    return {
      players: [],
      currentPage: 1,
      filterText: ''
    }
  },
  computed: {
    filteredPlayers () {
      return this.players.filter(player => player.name.toLowerCase().includes(this.filterText.toLowerCase()))
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
