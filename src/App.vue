<template lang="pug">
  #app(:class="customTheme")
    img.team-background(:src="`/images/teams/${userData.teamTheme}.svg`" v-if="userData && (userData.isPremier || userData.isUltimate) && userData.teamTheme")
    .site-wrapper
      main-menu
      b-notification(type="is-warning" v-if="notification.message") {{ notification.message }}
      b-loading(:is-full-page="true" :active.sync="isLoading" :can-cancel="false")
      router-view#rv(:key="$route.fullPath" v-if="liveConfig.canUseSite || (userData && userData.isAdmin)")
      .site-down(v-else)
        p {{ liveConfig.siteIsDownMessage || 'Site is currently undergoing maintenance.  If you are seeing this message for a prolonged amount of time, please make sure you have Kaspersky disabled as well as ad-blockers.  (There are no ads on the site)' }}
      //- report-issue(v-if="userData")
</template>

<script>
import firebase from 'firebase/app'

import userService from '@/services/user'

import mainMenu from '@/components/Menu'
import reportIssue from '@/components/ReportIssue'

export default {
  name: 'HighNoon',
  components: {
    mainMenu,
    reportIssue
  },
  computed: {
    customTheme () {
      if (!this.userData.id || !this.userData.teamTheme) return {}
      const teamTheme = { 'custom': true }
      teamTheme[`${this.userData.teamTheme}`] = true

      return teamTheme
    },
    isLoading () {
      return this.$store.getters.loading
    },
    userData () {
      return this.$store.getters.getUserData || { teamTheme: '' }
    }
  },
  data () {
    return {
      notification: {},
      liveConfig: {}
    }
  },
  mounted () {
    this.$store.dispatch('saveFireData', firebase.auth().currentUser)
    this.$store.dispatch('getPlayers')
    this.$store.dispatch('getTeams')
    this.$store.dispatch('fetchPickStats')
    this.$store.dispatch('setLoading', true)

    if (firebase.auth().currentUser) {
      userService.getProfile(firebase.auth().currentUser.uid)
        .then(userData => {
          this.userData = userData
          this.$store.dispatch('logIn', userData)
          this.$store.dispatch('setLoading', false)
        })
    } else this.$store.dispatch('setLoading', false)

    // setting config to be loaded here, so certain functions can count on variables being there.
    firebase.firestore().collection('config')
      .doc('owl')
      .onSnapshot((doc) => {
        const config = doc.data()
        this.$store.dispatch('loadConfig', config)
        this.$store.dispatch('getPlayerScores', `${config.currentWeek}`)
      })

    const db = firebase.database()
    db.ref('/notification/system').on('value', (snapshot) => {
      this.notification = snapshot.val() || {}
    })

    // set up live db listeners
    db.ref('/liveConfig').on('value', (snapshot) => {
      this.liveConfig = snapshot.val() || {}
      if (this.liveConfig.restart) {
        const lastUpdated = localStorage.getItem('lastRefresh')
        if (Number(lastUpdated < this.liveConfig.restart)) {
          localStorage.setItem('lastRefresh', this.liveConfig.restart)
          window.location.reload(true)
        }
      }
      this.$store.dispatch('saveLiveConfig', snapshot.val())
    })
    db.ref('/lockedPlayers').on('value', (snapshot) => {
      this.$store.dispatch('setLockedPlayers', snapshot.val() ? Object.values(snapshot.val()) : [])
    })
  }
}
</script>

<style lang="scss">
// Import Bulma's core
@import "~bulma/sass/utilities/_all";

// Set your colors
$primary: #f99e1a;
$primary-invert: findColorInvert($primary);
$secondary: #1f5ca1;
$twitter: #4099FF;
$dark-blue: #090c1c;
$slate: #2e3456;
$twitter-invert: findColorInvert($twitter);

// Setup $colors to use as bulma classes (e.g. 'is-twitter')
$colors: (
    "white": ($white, $black),
    "black": ($black, $white),
    "light": ($light, $light-invert),
    "dark": ($dark, $dark-invert),
    "primary": ($primary, $primary-invert),
    "info": ($info, $info-invert),
    "success": ($success, $success-invert),
    "warning": ($warning, $warning-invert),
    "danger": ($danger, $danger-invert),
    "twitter": ($twitter, $twitter-invert)
);

// Links
$link: $primary;
$link-invert: $primary-invert;
$link-focus-border: $primary;

@import "~bulma";
@import "~buefy/src/scss/buefy";
@import "./assets/styles/highnoon";
@import "./assets/styles/teams";
</style>
