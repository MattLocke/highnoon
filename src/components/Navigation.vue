<template lang="pug">
  .navigation
    nav.navbar(role="navigation", aria-label="main navigation")
      .navbar-brand
        a.navbar-brand(href="/") 
          img.logo(src="/static/img/high_noon.svg" alt="High Noon Pick'em - Fantasy Overwatch")
        button.button.navbar-burger(v-on:click="isBurgerActive = !isBurgerActive" v-bind:class="{ 'is-active': isBurgerActive }")
          span
          span
          span
      .navbar-menu(v-bind:class="{ 'is-active': isBurgerActive }")
        .navbar-end
          router-link.navbar-item.display-name(v-if="loggedIn" to="/Profile") {{ userData.displayName }}
          router-link.navbar-item(to="/") Home
          router-link.navbar-item(to="/News") News
          router-link.navbar-item(to="/Featured") Featured
          router-link.navbar-item(to="/Leaderboard") Leaderboard          
          router-link.navbar-item(v-if="!loggedIn" to="/Login") Log In / Sign Up
          a.navbar-item(v-if="loggedIn" v-on:click="logOut()") Logout
          a.navbar-item(v-if="!userData.isAdmin" href='https://www.patreon.com/highnoonpickem') Patreon
          router-link.navbar-item(v-else to="/Admin") Admin
    .notification.is-warning.centered(v-if="!isVerified")
      p You haven't verified your email yet.  Sometimes Google can be slow on sending the link.  Please be patient!  :)
      a.button.positive-button(v-on:click="resendVerification()" v-bind:class="{'is-loading': sendingVerification}" v-if="!verificationSent") Resend Verification Email
      a.button.positive-button.is-disabled(v-else) Sent!
    notification
</template>

<script>
  import firebase from 'firebase'
  // import fireUser from '@/services/user'
  import notification from '@/components/navigation/notification'

  export default {
    name: 'navigation',
    props: ['userData', 'isVerified'],
    components: {
      notification
    },
    data () {
      return {
        currentPage: 'home',
        isBurgerActive: false,
        verificationSent: false,
        sendingVerification: false,
        loaded: false
      }
    },
    computed: {
      loggedIn: function () {
        return this.$store.getters.isLoggedIn
      }
    },
    methods: {
      logOut: function () {
        var _this = this
        firebase.auth().signOut().then(function () {
          _this.$store.dispatch('logOut')
          _this.$router.push({path: '/Login'})
        }).catch(function (error) {
          // An error happened.
          _this.errorMessage = error
        })
      },
      isActive: function (title) {
        return title === this.currentPage
      },
      setActive: function (title) {
        this.currentPage = title
      },
      resendVerification: function () {
        var _this = this
        var user = firebase.auth().currentUser
        this.sendingVerification = true

        user.sendEmailVerification().then(function () {
          _this.sendingVerification = false
          _this.verificationSent = true
        }).catch(function (error) {
          console.error('Unable to send verification email.', error)
        })
      }
    },
    mounted: function () {
    }
  }
</script>

<style lang="scss" scoped>
  @import '../variables.scss';
  .logo {
    height: 2rem;
    width: auto;
    margin: auto;
    padding-left: 1rem;
  }
  .navbar-burger {
    color: #222;
  }
  .display-name {
    background-color: $owp-orange;
    color: #fff;
  }
</style>