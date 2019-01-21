<template lang="pug">
  .login
    .logowrap.has-text-centered
      img.logo(src="images/high_noon_white.svg")
      p.title-font HIGHNOON.GG
    .columns
      .column
      .column.is-narrow
        hr
        form(@submit.prevent="handleSubmit")
          b-field(label="Display Name" v-if="!signInMode")
            b-input(v-model="displayName" placeholder="Display Name")
          b-field(label="Email")
            b-input(v-model="user" placeholder="Email")
          b-field(label="Password")
            b-input(type="password" v-model="pass" placeholder="Password" password-reveal)
          .sign-in(v-if="signInMode")
            p.is-mice
              a(@click="resetPassword") Forget your password?
            hr
            button.button.is-primary(type="submit" v-if="canSignIn") Sign In
            a.button(disabled v-else) Sign In
            p.is-mice
              a.is-pulled-right(@click="signInMode = false") Or Sign Up
          .sign-up(v-else)
            hr
            button.button.is-primary(type="submit" v-if="canSignIn") Register
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
      signInMode: false,
      displayName: ''
    }
  },
  computed: {
    canSignIn () {
      return this.pass && this.user
    },
    loggedIn () {
      return this.$store.getters.isLoggedIn
    }
  },
  watch: {
    loggedIn: {
      immediate: true,
      handler () {
        if (this.loggedIn) this.$router.push({ path: this.leagueId ? `/leagues/${this.leagueId}` : '/home' })
      }
    }
  },
  methods: {
    handleSubmit () {
      if (this.canSignIn && this.signInMode) this.signIn()
      else this.register()
    },
    signIn () {
      this.$store.dispatch('setLoading', true)
      firebase.auth().signInWithEmailAndPassword(this.user, this.pass)
        .then((user) => {
          this.$store.dispatch('saveFireData', user.user)
          return userService.getProfile(user.user.uid)
        })
        .then(userData => {
          this.$store.dispatch('logIn', userData)
          this.$store.dispatch('setLoading', false)
          if (this.leagueId) this.$router.push({ path: '/ViewLeague/' + this.leagueId })
          else this.$router.push({ path: '/home' })
        })
        .catch((error) => {
          this.$store.dispatch('setLoading', false)
          this.$toast.open({
            message: `Error signing in: ${error.message}`,
            type: 'is-danger',
            position: 'is-bottom'
          })
        })
        .catch((error) => {
          this.$store.dispatch('setLoading', false)
          this.$toast.open({
            message: `Error signing in: ${error.message}`,
            type: 'is-danger',
            position: 'is-bottom'
          })
        })
    },
    register () {
      this.$store.dispatch('setLoading', true)
      firebase.auth().createUserWithEmailAndPassword(this.user, this.pass)
        .then((user) => {
          console.table(user)
          const userData = {
            id: user.user.uid,
            email: this.user,
            displayName: this.displayName,
            lifetimePoints: 0
          }
          userService.createProfile(userData)
            .then((data) => {
              // all is good in the hood, time to redirect.
              user.user.sendEmailVerification()
                .then(() => {
                  // send them an email verification.  They'll need that to do anything.
                  this.$store.dispatch('setLoading', false)
                  if (this.leagueId) this.$router.push({ path: '/ViewLeague/' + this.leagueId })
                  else {
                    this.$store.dispatch('logIn', userData)
                    this.$router.push({ path: '/home' })
                  }
                })
                .catch((error) => {
                  this.$store.dispatch('setLoading', false)
                  this.$toast.open({
                    message: `Error registering: ${error.message}`,
                    type: 'is-danger',
                    position: 'is-bottom',
                    duration: '10000'
                  })
                })
            })
            .catch((error) => {
              this.$toast.open({
                message: `Error registering: ${error.message}`,
                type: 'is-danger',
                position: 'is-bottom',
                duration: '10000'
              })
            })
        })
        .catch((error) => {
          this.$store.dispatch('setLoading', false)
          this.$toast.open({
            message: `Error registering: ${error.message}`,
            type: 'is-danger',
            position: 'is-bottom',
            duration: '10000'
          })
        })
    },
    resetPassword () {
      if (this.user) {
        firebase.auth().sendPasswordResetEmail(this.user)
          .then(() => {
            this.$toast.open({
              message: 'Your email is on the way!',
              type: 'is-success',
              position: 'is-bottom'
            })
          })
          .catch((error) => {
            this.$toast.open({
              message: `There was an error requesting your password reset: ${error.message}`,
              type: 'is-danger',
              position: 'is-bottom'
            })
          })
      } else {
        this.$toast.open({
          message: 'Please make sure to have a valid email in the username field.',
          type: 'is-warning',
          position: 'is-bottom'
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
    margin-top: 10vh;
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
