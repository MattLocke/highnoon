<template lang="pug">
  .password
    input.input.is-medium(placeholder="No PW Required", v-model="password")
    p If this is not blank, the user will be required to enter this when joining your league.
    button.button.positive-button(v-on:click="updatePassword()") Update Password
    p(v-if="message") {{ message }}
</template>

<script>
import fireLeague from '@/services/league'

export default {
  name: 'password',
  props: [
    'leagueId',
    'isOwner'
  ],
  data () {
    return {
      password: '',
      isLoading: false,
      message: ''
    }
  },
  methods: {
    updatePassword: function () {
      var _this = this
      _this.isLoading = true
      _this.message = ''
      fireLeague.setLeaguePassword(_this.leagueId, _this.password).then(function (result) {
        _this.isLoading = false
        if (result) _this.message = 'Successfully updated.'
        else _this.message = 'There was an error.'
      })
    }
  },
  mounted: function () {
    var _this = this

    if (_this.isOwner) {
      fireLeague.getLeaguePassword(_this.leagueId).then(function (password) {
        _this.password = password
      })
    }
  }
}
</script>
