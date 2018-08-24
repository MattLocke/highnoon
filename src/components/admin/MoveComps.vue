<template lang="pug">
  .move-comps
    h2 Move League Users and Leagues to new Comp
    label.label Old Comp
    input.input(type="text", v-model="oldComp")

    label.label New Comp
    input.input(type="text", v-model="newComp")

    label.label New Comp Name
    input.input(type="text", v-model="newCompName")
    hr
    button.button.positive-button(v-bind:class="{'is-loading': isLoading}" v-on:click="moveLeagues()") Move Leagues
    button.button.positive-button(v-bind:class="{'is-loading': isLoading}" v-on:click="moveLeagueUsers()") Move Users
    p(v-if="isDone") Completed.
</template>

<script>
import maintenance from '@/services/maintenance'

export default {
  name: 'move-comps',
  data () {
    return {
      isLoading: false,
      isDone: false,
      oldComp: '',
      newComp: '',
      newCompName: ''
    }
  },
  methods: {
    moveLeagues: function () {
      var _this = this
      this.isDone = false
      this.isLoading = true
      maintenance.moveLeagues(this.oldComp, this.newComp, this.newCompName).then(function (result) {
        _this.isLoading = false
        _this.isDone = true
      })
    },
    moveLeagueUsers: function () {
      var _this = this
      this.isDone = false
      this.isLoading = true
      maintenance.moveLeagueUsers(this.oldComp, this.newComp).then(function (result) {
        _this.isLoading = false
        _this.isDone = true
      })
    }
  }
}
</script>
