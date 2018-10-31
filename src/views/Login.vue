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
        .sign-in(v-if="signInMode")
          p.is-mice
            a(href="#") Forget your password?
          hr
          a.button.is-primary(@click="signIn" v-if="canSignIn") Sign In
          a.button(disabled v-else) Sign In
          p.is-mice
            a.is-pulled-right(@click="signInMode = false") Or Sign Up
        .sign-up(v-else)
          hr
          a.button.is-primary(@click="register" v-if="canSignIn") Register
          a.button(disabled v-else) Register
          p.is-mice
            a.is-pulled-right(@click="signInMode = true") Or Sign In
        b-loading(:is-full-page="true" :active.sync="isLoading" :can-cancel="false")
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
      verificationSent: false,
      signInMode: false
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
      firebase.auth().signInWithEmailAndPassword(this.user, this.pass)
        .then((user) => {
          userService.getProfile(user.user.uid)
            .then(userData => {
              this.$store.dispatch('logIn', userData)
              this.$store.dispatch('setLoading', false)
              if (this.leagueId) this.$router.push({ path: '/ViewLeague/' + this.leagueId })
              else this.$router.push({ path: '/home' })
            })
            .catch((error) => {
              this.$store.dispatch('setLoading', false)
              this.errorMessage = error.message
              this.showError = true
            })
        })
        .catch((error) => {
          this.$store.dispatch('setLoading', false)
          this.errorMessage = error.message
          this.showError = true
        })
    },
    register () {
      this.$store.dispatch('setLoading', true)
      firebase.auth().createUserWithEmailAndPassword(this.user, this.pass)
        .then((user) => {
          const userData = {
            id: user.uid,
            email: this.user,
            displayName: this.displayName,
            lifetimePoints: 0
          }
          userService.createProfile(userData)
            .then((data) => {
              // all is good in the hood, time to redirect.
              user.sendEmailVerification()
                .then(() => {
                  // send them an email verification.  They'll need that to do anything.
                  this.$store.dispatch('setLoading', false)
                  if (this.leagueId) this.$router.push({ path: '/ViewLeague/' + this.leagueId })
                })
            })
        })
        .catch((error) => {
          this.$store.dispatch('setLoading', false)
          this.errorMsg = error.message
          this.showError = true
        })
    },
    forgotPassword () {
      if (this.user) {
        firebase.auth().sendPasswordResetEmail(this.user)
          .then(() => {
            // Email sent.
            this.forgotSent = true
          })
          .catch((error) => {
            // An error happened.
            console.error(error)
          })
      }
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
    min-width: 100px;
    min-height: 100px;
  }
}
.login .box label.label {
  color: #fff;
}
</style>
