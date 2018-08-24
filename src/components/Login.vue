<template lang="pug">
  .login
    .notification.is-danger(v-if="errorMsg")
      button.delete(v-on:click="errorMsg = false")
      p {{ errorMsg }}
    .section
      .container.large-gap
        .columns
          .column.is-half-desktop.centered
            span.big.header-font Make an account.
            span.big.header-font Pick your teams.
            span.big.header-font Lead the board.
          .column.is-half-desktop
            .hoverable.existing(v-if="!isNew")
              .box
                form
                  .field
                    label(for="email_address") Email Address
                    .control
                      input.input#email_address(placeholder="Email Address", type="email", class="validate", v-model="user", v-on:keyup.enter="signIn")
                  .field
                    label(for="password") Password
                    .control
                      input.input#password(placeholder="", type="password", class="validate", v-model="pass", v-on:keyup.enter="signIn")
                      p
                        a.forgot-password(v-on:click="forgotPassword()") Forget your password?
                    .notification.is-info(v-if="forgotSent")
                      p Your password reset link has been sent to your email (if it exists).  Please check your email and remember your password next time!  :P
                  .field
                    a.button.positive-button.is-large(v-on:click="signIn" v-bind:class="{'is-loading': isLoading}") Log In
                    a.is-pulled-right.alt-text(v-on:click="isNew = true") Sign Up
            .hoverable.isNew(v-if="isNew")
              .box
                form
                  .field
                    label(for="user_name") Display Name
                    .control
                      input.input#user_name(placeholder="Display Name", type="text", class="validate", v-model="displayName")
                  .field
                    label(for="email_address") Email Address
                    .control
                      input.input#email_address(placeholder="Email Address", type="email", class="validate", v-model="user")
                    .notification.is-warning(v-if="usingPlus")
                      p Sorry!  We noticed firebase auth doesn't send verify email address to emails with "+" in them!
                  .field
                    label(for="password") Password
                    .control
                      input.input#password(placeholder="", type="password", class="validate", v-model="pass")
                  .field
                      a.button.positive-button.is-large(v-on:click="signUp" v-bind:class="{'is-loading': isLoading}") Sign Up
                      a.is-pulled-right.alt-text(v-on:click="isNew = false") Log In
                p.small-type Please make sure you have no script blockers running.  Ad blockers are okay, just things like noScript will break things!

    .section.white-section
      .container.is-fluid.is-white
        .container
          .columns
            .column
              .box.info-trio.centered
                img(src="/assets/img/logo.svg" alt="Logo")
                h2.overwatch-font You call the shots in your own fantasy Overwatch
                  sup tm
                  |  league.
            .column
              .box.info-trio.centered
                img(src="/assets/img/stars.svg" alt="Stars")
                h2.overwatch-font Compete against friends or the community while you watch your favorite teams.
            .column
              .box.info-trio.centered
                img(src="/assets/img/stats.svg" alt="Stats")
                h2.overwatch-font Scoreboards and global standings are updated daily.
          .centered
             router-link.is-large.button.positive-button.how-pad(to="/FAQ") How It Works
    .section
      .container
        global-top
    .section.white-section.is-hidden-mobile
      .container
        .columns
          .column.is-one-third-desktop
            img.is-circle.is-pulled-right(src="/assets/img/me.jpg")
            .is-clearfix
          .column.is-two-thirds-desktop
            h4 Support The Dev
            p I'm Matt Locke, the developer who created High Noon Pick'em. A hell of a lot pizza, coffee and time
              br
              | went into building the app so far. High Noon Pick'em will always be free, but if you want to help a starving dev buy more pizza and coffee (and server usage), you can click below!
            a.button.positive-button(href="https://paypal.me/mattlocke/5") Help a brutha out
    .section.white-section.is-hidden-tablet
      .container
        .columns
          .column.is-one-third-desktop.centered
            img.is-circle.mobile-circle(src="/assets/img/me.jpg")
          .column.is-two-thirds-desktop.centered
            h4 Support The Dev
            p I'm Matt Locke, the developer who created High Noon Pick'em. A hell of a lot pizza, coffee and time went into building the app so far. High Noon Pick'em will always be free, but if you want to help a starving dev buy more pizza and coffee (and server usage), you can click below!
            a.button.positive-button(href="https://paypal.me/mattlocke/5") Help a brutha out
</template>

<script>
import firebase from 'firebase'
import fireUser from '@/services/user'
import globalTop from '@/components/home/GlobalTop'

export default {
  name: 'Login',
  components: {
    globalTop
  },
  data () {
    return {
      displayName: null,
      isNew: true,
      user: null,
      pass: null,
      errorMsg: null,
      newUser: false,
      forgotSent: false,
      isLoading: false,
      leagueId: '',
      showVerification: false,
      verificationSent: false
    }
  },
  methods: {
    signIn: function () {
      this.isLoading = true
      var _this = this
      this.errorMsg = null
      this.newUser = false // in case they go full retard
      firebase.auth().signInWithEmailAndPassword(_this.user, _this.pass).then(function (user) {
        if (_this.leagueId) _this.$router.push({path: '/ViewLeague/' + _this.leagueId})
        else _this.$router.push({path: '/'})
      }).catch(function (error) {
        _this.isLoading = false
        _this.errorMsg = error.message
      })
    },
    signUp: function () {
      this.isLoading = true
      var _this = this
      this.errorMsg = null
      this.newUser = true
      if (!this.pass) {
        this.errorMsg = 'You need a password silly goose!'
        this.isLoading = false
        return
      }
      if (!this.displayName) {
        this.isLoading = false
        this.errorMsg = 'You need a display name.  Invisible people don\'t belong here!  Wait, where\'d you go!?'
        return
      }
      firebase.auth().createUserWithEmailAndPassword(_this.user, _this.pass).then(function (user) {
        var userData = {
          id: user.uid,
          email: _this.user,
          displayName: _this.displayName,
          lifetimePoints: 0
        }
        fireUser.createProfile(userData).then(function (data) {
          // all is good in the hood, time to redirect.
          user.sendEmailVerification().then(function () {
            // send them an email verification.  They'll need that to do anything.
            _this.isLoading = false
            if (_this.leagueId) _this.$router.push({path: '/ViewLeague/' + _this.leagueId})
            else _this.$router.push({path: '/'})
          })
        })
      }).catch(function (error) {
        _this.isLoading = false
        _this.errorMsg = error.message
      })
    },
    forgotPassword: function () {
      if (this.user) {
        var _this = this
        var auth = firebase.auth()
        auth.sendPasswordResetEmail(this.user).then(function () {
          // Email sent.
          _this.forgotSent = true
        }).catch(function (error) {
          // An error happened.
          console.error(error)
        })
      }
    }
  },
  computed: {
    usingPlus: function () {
      if (this.user) return this.user.includes('+')
      else return false
    }
  },
  mounted: function () {
    this.leagueId = this.$route.params.leagueId
  }
}
</script>

<style scoped lang="scss">
  @import '../variables.scss';
  .small-type {
    font-size: .7rem;
  }
  .alt-text {
    line-height: 3rem;
  }
  h2 sup {
    font-size: .9rem;
  }
  .how-pad {
    margin-top: 1rem;
  }
  .is-circle {
    border-radius: 50%;
    display: block;
    height: 120px;
    width: auto;
    margin-right: 3rem;
  }
  .mobile-circle {
    margin: auto;
  }
  .white-section {
    background-color: #fff;
  }
  .orange-section {
    background-color: $owp-orange;
  }
  .info-trio {
    min-height: 340px;
    img {
      height: 150px;
      width: auto;
    }
  }
  label {
    display: block;
    padding-bottom: .2rem;
  }
  .gap-left {
    margin-left: 1rem;
  }
  span.big {
    font-size: 3rem;
    display: block;
    color: #fff;
  }
  .large-gap {
    padding: 4rem 0;
  }
  .login {
    background: url('/assets/img/login-back.jpg');
    background-size: cover;
    background-position: fixed;
  }
  .really-small {
    font-size: 10px;
  }
  .really-small:hover {
    cursor: pointer;
  }
  .forgot-password {
    font-size: .7rem;
  }
</style>
