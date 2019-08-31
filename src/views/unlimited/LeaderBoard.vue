<template lang="pug">
  .unlimited-leaderboard
    b-table(
      :data="userTotalsMap"
      :paginated="true"
      :per-page="30"
      )
      template(slot-scope="props")
        b-table-column(label="Pos" field="pos" width="20" sortable)
          span {{ props.row.pos }}
        b-table-column(label="User" width="180")
          router-link(:to="`/user/${props.row.userId}`") {{ getUsername(props.row.userId) }}
        b-table-column(label="Team Name")
          span {{ getTeamName(props.row.userId) || 'N/A' }}
        b-table-column(label="S1" field="stage1" sortable width="100")
          span {{ props.row.stage1 | playerScore }}
        b-table-column(label="S2" field="stage2" sortable width="100")
          span {{ props.row.stage2 | playerScore }}
        b-table-column(label="S3" field="stage3" sortable width="100")
          span {{ props.row.stage3 | playerScore }}
        b-table-column(label="S4" field="stage4" sortable width="100")
          span {{ props.row.stage4 | playerScore }}
        b-table-column(label="Score" width="30" field="grandTotal" sortable)
          span {{ props.row.grandTotal | playerScore }}
</template>

<script>
import LeagueService from '@/services/league'

export default {
  name: 'UnlimitedLeaderBoard',
  props: {
    leagueId: {
      type: String,
      require: true
    },
    leagueUsers: {
      type: [Array, Object],
      required: true
    }
  },
  data () {
    return {
      userTotalsMap: {}
    }
  },
  computed: {
    leagueUsersMap () {
      const userMap = {}
      this.leagueUsers.forEach(lu => {
        if (lu.userId) {
          userMap[lu.userId] = lu
        }
      })
      return userMap
    }
  },
  mounted () {
    LeagueService.getUnlimitedTotals(this.leagueId).then((userTotals) => {
      this.userTotalsMap = userTotals.map((ut, index) => ({ ...ut, pos: index + 1 }))
    })
  },
  methods: {
    getTeamName (userId) {
      return this.leagueUsersMap[userId] ? this.leagueUsersMap[userId].teamName : ''
    },
    getUsername (userId) {
      return this.leagueUsersMap[userId] ? this.leagueUsersMap[userId].displayName : ''
    }
  }
}
</script>
