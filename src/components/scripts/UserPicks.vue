<template lang="pug">
  .bob
    section.section
      .container
        .box
          h2 Get Users Pick Data
          .field
            label.label LeagueId
            input.input(v-model="leagueId")
          .field
            label.label Stage
            input.input(v-model="stage")
          .field
            label.label UserId
            input.input(v-model="userId")
          button.button.positive-button(v-on:click="getPick()") Get Pick / User
        .box
          h3 League User
          ul
            li Id: {{ leagueUser.id }}
            li Points: {{ leagueUser.points }}
            li Stage 1: {{ leagueUser.stage1Points }}
            li Stage 2: {{ leagueUser.stage2Points }}
            li Stage 3: {{ leagueUser.stage3Points }}
        .box
          h3 Manual Update:
          .field
            label.label Document
            input.input(type='text' v-model="document")
          .field
            label.label Document Id
            input.input(type='text' v-model="documentId")
          .field
            label.label Value
            input.input(type='number' v-model="newValue")
          button.button.positive-button(v-on:click="")
        .box
          h3 Total Points: {{ totalPoints }}
        .box(v-for="pick in picks")
          ul
            li Winner: {{ pick.winnerName }}
            li Points: {{ pick.points }}
</template>

<script>
import firePick from '@/services/pick'
import fireLeague from '@/services/league'

export default {
  name: 'UserPicks',
  data () {
    return {
      stage: 'Stage 3',
      leagueId: 'stJt6rYFcqH8TcKzamcM',
      userId: '2XFdbyHhxpRmu0Sqx7UyDCfKrXF3',
      picks: [],
      leagueUser: {}
    }
  },
  computed: {
    totalPoints: function () {
      var total = 0
      this.picks.forEach(function (pick) {
        total += pick.points
      })
      return total
    }
  },
  methods: {
    getPick: function () {
      var _this = this
      // get all picks for this match where winner is winner
      firePick.getPicks(this.userId, this.leagueId, this.stage).then(function (picks) {
        _this.picks = picks
      })

      fireLeague.getLeagueUser(this.leagueId, this.userId).then(function (user) {
        _this.leagueUser = user[0] || {}
      })
    }
  }
}
</script>

<style lang="scss">
  @import '../../variables.scss';
</style>
