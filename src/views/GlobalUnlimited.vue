<template lang="pug">
  .global-pickem.container
    h1 Global Unlimited Leaderboard
    section
      h2 Your Position:
        span.orange  {{ yourPosition.pos }}
      b-table(
        :data="withPlaces"
        ref="table"
        paginated)
        template(slot-scope="props")
          b-table-column(label="Pos." width="30" field="pos")
            span.title-font {{ props.row.pos }}
          b-table-column(label="Display Name" field="displayName")
            span.title-font {{ props.row.displayName }}
          b-table-column(label="S1" width="30" field="stage1Score" sortable)
            span.title-font {{ props.row.stage1Score | playerScore }}
          b-table-column(label="S2" width="30" field="stage2Score" sortable)
            span.title-font {{ props.row.stage2Score | playerScore }}
          b-table-column(label="S3" width="30" field="stage3Score" sortable)
            span.title-font {{ props.row.stage3Score | playerScore }}
          b-table-column(label="S4" width="30" field="stage4Score" sortable)
            span.title-font {{ props.row.stage4Score | playerScore }}
          b-table-column(label="Total Score" width="30" field="totalScore" sortable)
            span.title-font {{ props.row.totalScore | playerScore }}
</template>

<script>
import LeagueService from '@/services/league'

export default {
  name: 'GlobalLeaderboard',
  data () {
    return {
      leaders: [],
      withPlaces: [],
      yourPosition: {}
    }
  },
  computed: {
    userData () {
      return this.$store.getters.getUserData
    }
  },
  watch: {
    leaders () {
      let counter = 0
      this.withPlaces = this.leaders.map((l) => {
        counter++
        if (this.userData && this.userData.id === l.userId) this.yourPosition = { ...l, pos: counter }
        return { ...l, pos: counter }
      })
    }
  },
  mounted () {
    LeagueService.getUnlimitedLeaderboards().then((users) => {
      this.leaders = users
    })
  }
}
</script>
