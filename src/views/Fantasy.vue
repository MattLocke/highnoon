<template lang="pug">
  .fantasy
    .columns
        .column.is-one-quarter
          .wrap
            p Fantasy
        .column
          .wrap
            .box
              h1 Fantasy
              b-table(
                :data="players"
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
              //- table.table.is-fullwidth
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
      players: [],
      currentPage: 1
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
