<template lang="pug">
  .fantasy
    .wrap
      .box
        h1 Fantasy
        hr
        .columns.is-desktop
          .column
            team-slot(roleType="Damage")
          .column
            team-slot(roleType="Tank")
          .column
            team-slot(roleType="Support")
          .column
            team-slot(roleType="Flex")
        //- b-table(
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
