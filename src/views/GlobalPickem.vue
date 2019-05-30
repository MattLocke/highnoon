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
          b-table-column(label="Points" width="30" field="points")
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
