<template lang="pug">
  .expire-leagues
    h2 Expire Leagues
    .select
      select(v-model="activeCompetition")
        option(v-for="comp in competitions", v-bind:value="comp.id") {{ comp.name }}
    button.button.positive-button(v-bind:class="{'is-loading': isLoading}" v-on:click="expireLeagues()") Expire Old Leagues For Users
    p(v-if="isDone") Leagues Expired
</template>

<script>
import maintenance from '@/services/maintenance'
import fireComp from '@/services/competition'

export default {
  name: 'expire-leagues',
  data () {
    return {
      isLoading: false,
      isDone: false,
      competitions: [],
      activeCompetition: ''
    }
  },
  methods: {
    expireLeagues: function () {
      var _this = this
      _this.isLoading = true
      // go through matchPicks, get matchId and userId
      maintenance.deactivateOldLeagues(_this.activeCompetition).then(function () {
        _this.isDone = true
        _this.isLoading = false
      })
    },
    getOldComps: function () {
      var _this = this
      fireComp.getOldCompetitions().then(function (competitions) {
        if (competitions) _this.competitions = competitions
      })
    }
  },
  mounted: function () {
    this.getOldComps()
  }
}
</script>
