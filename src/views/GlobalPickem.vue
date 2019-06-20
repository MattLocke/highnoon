<template lang="pug">
  .global-pickem.container
    h1 Global Pick'em Leaderboard
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
          b-table-column(label="S1" width="30" field="stage1" sortable)
            span.title-font {{ props.row.stage1 }}
          b-table-column(label="S2" width="30" field="stage2" sortable)
            span.title-font {{ props.row.stage2 }}
          b-table-column(label="S3" width="30" field="stage3" sortable)
            span.title-font {{ props.row.stage3 }}
          b-table-column(label="S4" width="30" field="stage4" sortable)
            span.title-font {{ props.row.stage4 }}
          b-table-column(label="Points" width="30" field="points" sortable)
            span.title-font {{ props.row.points }}
</template>

<script>
import PicksService from '@/services/picks'

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
    PicksService.getGlobalLeaderboards().then((users) => {
      this.leaders = users
    })
  }
}
</script>
