<template lang="pug">
  .populate-data
    h2 Populate Data
    .box
      a.button.positive-button(v-on:click="createComp()") Create Comp
      p(v-if="successComp") Successfully created the comp!
    .box
      label.label Comp Id
        .control
          select.select.is-large(v-model="compId")
            option(v-for="comp in competitions" v-bind:value="comp.id") {{ comp.name }}
      a.button.positive-button(v-on:click="createTeams()") Create Teams
      p(v-if="successTeams") Successfully created the teams!
    .box
      a.button.positive-button(v-on:click="setAllTeams()") Set Generic Team
</template>

<script>
  import firePopulate from '@/services/populate'
  import fireComp from '@/services/competition'

  export default {
    name: 'populate-data',
    data () {
      return {
        successComp: false,
        successTeams: false,
        compId: '',
        competitions: []
      }
    },
    methods: {
      createComp: function () {
        var _this = this
        firePopulate.populateCompetition().then(function () {
          _this.successComp = true
        })
      },
      createTeams: function () {
        if (this.compId) {
          firePopulate.populateTeams(this.compId)
          this.successTeams = true
        }
      },
      setAllTeams: function () {
        firePopulate.populateGenericTeams()
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