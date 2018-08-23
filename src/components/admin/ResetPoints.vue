<template lang="pug">
  .reset-points
    h2 Reset Points
    .field
      label.label Competition
      select.select(v-model="activeComp")
        option Competition
        option(v-for="comp in competitions" v-bind:value="comp.id") {{ comp.name }}
    button.button.positive-button(v-bind:class="{'is-loading': isLoading}" v-on:click="cleanPointsForComp()") Reset Points

    p(v-if="isDone") Points reset.
</template>

<script>
  import maintenance from '@/services/maintenance'
  import fireComp from '@/services/competition'

  export default {
    name: 'reset-points',
    data () {
      return {
        isLoading: false,
        isDone: false,
        activeComp: '',
        competitions: []
      }
    },
    methods: {
      cleanPointsForComp: function () {
        var _this = this
        _this.isLoading = true
        // go through matchPicks, get matchId and userId
        maintenance.cleanPointsForComp(_this.activeComp).then(function (users) {
          var i = 0
          var tmp = []
          users.forEach(function (user) {
            i++
            tmp.push(user)
            if (i >= 400) {
              maintenance.applyClean(tmp)
              tmp = []
              i = 0
            }
          })
          maintenance.applyClean(tmp)
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