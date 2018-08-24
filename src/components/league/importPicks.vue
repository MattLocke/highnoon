<template lang="pug">
  .import-picks
    h2 Import Picks
      span.orange-text  (Replaces Picks)
    .select
      select.stay-small(v-model="referenceLeague")
        option(v-for="league in currentLeagues" v-bind:value="league.leagueId") {{ leagueMode(league) }}
    button.button.positive-button(v-if="isSure" v-on:click="importPicks()" v-bind:class="{'is-loading': isLoading}" :disabled="isLoading") Confirm
    button.button.negative-button(v-else v-on:click="seeIfSure()" v-bind:disabled="isLoading" disabled) Import
</template>

<script>
// import firePick from '@/services/pick'
import fireLeague from '@/services/league'

export default {
  name: 'import-picks',
  props: [
    'leagueId', 'userId'
  ],
  data () {
    return {
      isSure: false,
      referenceLeague: '',
      currentLeagues: [],
      isLoading: true
    }
  },
  methods: {
    seeIfSure: function () {
      this.isSure = true
    },
    leagueMode (league) {
      var theName = league.leagueName
      return theName
    },
    importPicks: function () {
      var _this = this
      _this.isLoading = true
      alert('This feature is temporarily disabled for now so I can make sure it does not mess with any picks.  Thank you for understanding while I test things!')
      // firePick.deletePicks(this.leagueId, this.userId).then(function (response) {
      //   firePick.getPicks(_this.userId, _this.referenceLeague).then(function (picks) {
      //     picks.forEach(function (pick) {
      //       pick.leagueId = _this.leagueId
      //     })
      //     firePick.createMultiplePicks(picks)
      //   })
      // })
    },
    getLeagues: function () {
      var _this = this
      fireLeague.getLeaguesByUser(this.userId).then(function (leagues) {
        _this.currentLeagues = leagues
        _this.isLoading = false
      })
    }
  },
  mounted: function () {
    this.getLeagues()
  }
}
</script>

<style scoped>
  .stay-small {
    max-width: 180px;
  }
</style>
