<template lang="pug">
  .assign-points
    h2 Assign Points
    .field
      label.label Competition
      select.select(v-model="activeComp" v-on:change="getMatches()")
        option Competition
        option(v-for="comp in competitions" v-bind:value="comp.id") {{ comp.name }}
    .field
      label.label Match
      select.select(v-model="activeMatch")
        option Match
        option(v-for="match in matches" v-bind:value="match.id") {{ match.homeTeamShortName }} vs {{ match.awayTeamShortName }}
    button.button.positive-button(v-bind:class="{'is-loading': isLoading}" v-on:click="assignPoints()") Assign Points

    p(v-if="isDone") Points assigning...
</template>

<script>
  import points from '@/services/points'
  import fireComp from '@/services/competition'
  import fireMatch from '@/services/match'

  export default {
    name: 'assign-points',
    data () {
      return {
        isLoading: false,
        isDone: false,
        activeComp: '',
        activeMatch: '',
        competitions: [],
        matches: []
      }
    },
    methods: {
      assignPoints: function () {
        var _this = this
        _this.isLoading = true
        points.assignPoints(_this.activeMatch).then(function () {
          console.log('loading, stay a while!')
          _this.isDone = true
          _this.isLoading = false
        })
      },
      getMatches: function () {
        console.log('Getting matches...')
        var _this = this
        fireMatch.getOldLeagueMatches(this.activeComp).then(function (matches) {
          _this.matches = matches
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