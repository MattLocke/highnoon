<template lang="pug">
  .update-league-users
    h2 Update League Users
    p Updates the league users to assign simpleMode and competitionId to the leagueUser object. (temporary)
    .field
      label.label Competition
      select.select(v-model="activeComp")
        option Competition
        option(v-for="comp in competitions" v-bind:value="comp.id") {{ comp.name }}
    button.button.positive-button(v-bind:class="{'is-loading': isLoading}" v-on:click="updateLeagueUsers()") Update Users

    p(v-if="isDone") League Users Updated.
</template>

<script>
import maintenance from '@/services/maintenance'
import fireComp from '@/services/competition'

export default {
  name: 'update-league-users',
  data () {
    return {
      isLoading: false,
      isDone: false,
      activeComp: '',
      competitions: []
    }
  },
  methods: {
    updateLeagueUsers: function () {
      var _this = this
      _this.isLoading = true
      // go through matchPicks, get matchId and userId
      maintenance.updateLeagueUsers(_this.activeComp).then(function () {
        _this.isDone = true
        _this.isLoading = false
      })
    }
  },
  mounted: function () {
    var _this = this
    fireComp.getCompetitions().then(function (comps) {
      _this.competitions = comps
    })
  }
}
</script>
