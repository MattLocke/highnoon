<template lang="pug">
  .toggle-lottery
    h3.overwatch-font Lottery Mode
    input#lotterymode.tgl.tgl-flip(type = "checkbox" v-model="leagueData.lotteryMode" value="true")
    label.tgl-btn(data-tg-off = "Disabled", data-tg-on = "Enabled", for = "lotterymode")
    p This enables lottery mode for the league.
    button.button.positive-button(v-on:click="toggleLottery()" v-bind:class="{'is-loading': isLoading}") Update Mode
    p(v-if="lotterySuccess") {{ lotterySuccess }}
    p(v-if="lotteryError") {{ lotteryError }}
</template>

<script>
import fireLeague from '@/services/league'
export default {
  name: 'toggleLottery',
  props: [
    'leagueData',
    'leagueId'
  ],
  data () {
    return {
      lotteryError: '',
      lotterySuccess: '',
      isLoading: false
    }
  },
  methods: {
    toggleLottery: function () {
      var _this = this
      _this.isLoading = true
      fireLeague.toggleLottery(_this.leagueId, _this.leagueData.lotteryMode).then(function () {
        var lotteryStatus = 'Default Mode'
        if (_this.leagueData.lotteryMode) lotteryStatus = 'Lottery Mode'
        _this.lotterySuccess = 'Updated status to: ' + lotteryStatus
        _this.isLoading = false
      }).catch(function (error) {
        _this.lotteryError = 'Unable to toggle lottery mode: ' + error
        _this.isLoading = false
      })
    }
  }
}
</script>

<style scoped>
  .tgl + .tgl-btn {
    width: 6rem;
  }
</style>
