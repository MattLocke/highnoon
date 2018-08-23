<template lang="pug">
  .toggle-simple
    h3.overwatch-font Simple Mode
    input#simplemode.tgl.tgl-flip(type = "checkbox" v-model="leagueData.simpleMode" value="true")
    label.tgl-btn(data-tg-off = "Disabled", data-tg-on = "Enabled", for = "simplemode")
    p This removes map picks and allows winner/base score only.
    button.button.positive-button(v-on:click="toggleSimple()" v-bind:class="{'is-loading': isLoading}") Update Mode
    p(v-if="simpleSuccess") {{ simpleSuccess }}
    p(v-if="simpleError") {{ simpleError }}
</template>

<script>
  import fireLeague from '@/services/league'
  export default {
    name: 'toggleSimple',
    props: [
      'leagueData',
      'leagueId'
    ],
    data () {
      return {
        simpleError: '',
        simpleSuccess: '',
        isLoading: false
      }
    },
    methods: {
      toggleSimple: function () {
        var _this = this
        _this.isLoading = true
        fireLeague.toggleSimple(_this.leagueId, _this.leagueData.simpleMode).then(function () {
          var simpleStatus = 'Default Mode'
          if (_this.leagueData.simpleMode) simpleStatus = 'Simple Mode'
          _this.simpleSuccess = 'Updated status to: ' + simpleStatus
          _this.isLoading = false
        }).catch(function (error) {
          _this.simpleError = 'Unable to toggle simple mode: ' + error
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