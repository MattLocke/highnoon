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
                field="id"
                label="Id"
                sortable
              ) {{ props.row.id }}
              b-table-column(
                field="name"
                label="Name"
                sortable
              ) {{ props.row.name }}
              b-table-column(
                field="role"
                label="Role"
                sortable
              ) {{ props.row.role }}
              b-table-column(
                field="team"
                label="Team"
                sortable
              ) {{ props.row.team }}
              b-table-column(label="Score" width="40")
                span {{ getScore(props.row.id) | playerScore }}
</template>

<script>
import TeamSlot from '@/views/fantasy/TeamSlot'

export default {
  name: 'fantasy',
  components: {
    TeamSlot
  },
  data () {
    return {
      currentPage: 1,
      filterText: ''
    }
  },
  computed: {
    filteredPlayers () {
      return this.players.filter(player => player.name && player.name.toLowerCase().includes(this.filterText.toLowerCase()))
    },
    players () {
      return Object.values(this.$store.getters.getPlayers)
    },
    playerScores () {
      return this.$store.getters.getPlayerScores || {}
    }
  },
  methods: {
    getScore (playerId) {
      return Number(this.playerScores[playerId]) || 0
    }
  }
}
</script>
