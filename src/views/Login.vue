<template lang="pug">
  .login
    .columns
      .column
      .column.is-narrow
        .box
          b-field(label="Email")
            b-input(v-model="user")
          b-field(label="Pass")
            b-input(type="password" v-model="pass" password-reveal)
          a.button.is-primary(@click="signIn" v-if="canSignIn") Sign In
          a.button(disabled v-else) Sign In
          b-loading(:is-full-page="true" :active.sync="isLoading" :can-cancel="false")
          b-notification(:active.sync="showError")
      .column
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  name: 'Login',
  data () {
    return {
      errorMessage: null,
      forgotSent: false,
      isLoading: false,
      leagueId: null,
      newUser: false,
      pass: null,
      showError: false,
      showVerification: false,
      user: null,
      verificationSent: false
    }
  },
  computed: {
    canSignIn () {
      return this.pass && this.user
    }
  },
  methods: {
    signIn () {
      this.isLoading = true
      const _this = this
      firebase.auth().signInWithEmailAndPassword(_this.user, _this.pass)
        .then(function (user) {
          if (_this.leagueId) _this.$router.push({ path: '/ViewLeague/' + _this.leagueId })
          else _this.$router.push({ path: '/home' })
        }).catch(function (error) {
          _this.isLoading = false
          _this.errorMessage = error
          _this.showError = true
        })
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

<style lang="scss">
.login .box label.label {
  color: #fff;
}
</style>
