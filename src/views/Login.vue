<template lang="pug">
  .login
    p This is the login
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'Login',
  data () {
    return {
      forgotSent: false,
      isLoading: false,
      leagueId: null,
      newUser: false,
      pass: null,
      showVerification: false,
      user: null,
      verificationSent: false
    }
  },
  methods: {
    signIn () {
      this.isLoading = true
    },
    signUp () {
    },
    forgotPassword () {
    }
  },
  mounted () {
    this.leagueId = this.$route.params.leagueId
  }
}
</script>

