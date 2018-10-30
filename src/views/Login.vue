<template lang="pug">
  .login
    .logowrap.has-text-centered
      img.logo(src="images/high_noon_white.svg")
      p.title-font HIGHNOON.GG
    .columns
      .column
      .column.is-narrow
        hr
        b-field(label="Email")
          b-input(v-model="user" placeholder="Email")
        b-field(label="Password")
          b-input(type="password" v-model="pass" placeholder="Password" password-reveal)
        .sign-in
          a.button.is-primary(@click="signIn" v-if="canSignIn") Sign In
          a.button(disabled v-else) Sign In
        .sign-up
          p.is-mice.is-pulled-right
            a(href="#") Or Sign Up
        b-loading(:is-full-page="true" :active.sync="isLoading" :can-cancel="false")
        b-notification(:active.sync="showError") {{ errorMessage }}
      .column
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'

import userService from '@/services/user'

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
      this.$store.dispatch('setLoading', true)
      const _this = this
      firebase.auth().signInWithEmailAndPassword(_this.user, _this.pass)
        .then(function (user) {
          userService.getProfile(user.user.uid)
            .then(userData => {
              _this.$store.dispatch('logIn', userData)
              _this.$store.dispatch('setLoading', false)
              if (_this.leagueId) _this.$router.push({ path: '/ViewLeague/' + _this.leagueId })
              else _this.$router.push({ path: '/home' })
            })
            .catch(function (error) {
              _this.$store.dispatch('setLoading', false)
              _this.errorMessage = error
              _this.showError = true
            })
        })
        .catch(function (error) {
          _this.$store.dispatch('setLoading', false)
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
.login {
  min-height: 100vh;
  background-image: radial-gradient(#263277, #090c1c);
  .sign-in-or-up {
    margin-top: 2rem;
  }
  .title-font {
    font-size: 2rem;
    font-weight: 400;
  }
  .logo {
    margin-top: 20vh;
    width: 10vw;
    height: 10vw;
  }
}
.login .box label.label {
  color: #fff;
}
</style>
