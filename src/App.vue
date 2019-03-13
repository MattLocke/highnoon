<template lang="pug">
  #app
    main-menu
    b-notification(type="is-warning" v-if="notification.message") {{ notification.message }}
    b-loading(:is-full-page="true" :active.sync="isLoading" :can-cancel="false")
    router-view#rv(:key="$route.fullPath" v-if="liveConfig.canUseSite || (userData && userData.isAdmin)")
    .site-down(v-else)
      p {{ liveConfig.siteIsDownMessage || 'Site is currently undergoing maintenance.  If you are seeing this message for a prolonged amount of time, please make sure you have Kaspersky disabled as well as ad-blockers.  (There are no ads on the site)' }}
    report-issue(v-if="userData")
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
    isLoading () {
      return this.$store.getters.loading
    }
  },
  data () {
    return {
      notification: {},
      liveConfig: {},
      userData: null
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
          window.location.reload()
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

// Import Bulma and Buefy styles
@import "~bulma";
@import "~buefy/src/scss/buefy";

/* Fonts */
@font-face {
  font-family: 'titleFont';
  src: url('./assets/fonts/Acre.eot');
  src: url('./assets/fonts/Acre.eot?#iefix') format('embedded-opentype'),
    url('./assets/fonts/Acre.woff') format('woff'),
    url('./assets/fonts/Acre.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: 'headerFont';
  src: url('./assets/fonts/BigNoodleTooOblique.eot');
  src: url('./assets/fonts/BigNoodleTooOblique.eot?#iefix') format('embedded-opentype'),
    url('./assets/fonts/BigNoodleTooOblique.woff') format('woff'),
    url('./assets/fonts/BigNoodleTooOblique.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: 'overFont';
  src: url('./assets/fonts/Koverwatch.eot');
  src: url('./assets/fonts/Koverwatch.eot?#iefix') format('embedded-opentype'),
    url('./assets/fonts/Koverwatch.woff') format('woff'),
    url('./assets/fonts/Koverwatch.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

.loading-overlay .loading-background {
  background-color: rgba(0,0,0,0.8);
}

@media only screen and (max-width: 769px) {
  #rv {
    margin-right: 0;
  }
}

/* Tooltip Stuff */
.tooltip {
  display: block !important;
  z-index: 10000;

  .tooltip-inner {
    background: black;
    color: white;
    border-radius: 16px;
    padding: 5px 10px 4px;
  }

  .tooltip-arrow {
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    margin: 5px;
    border-color: black;
    z-index: 1;
  }

  &[x-placement^="top"] {
    margin-bottom: 5px;

    .tooltip-arrow {
      border-width: 5px 5px 0 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      bottom: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^="bottom"] {
    margin-top: 5px;

    .tooltip-arrow {
      border-width: 0 5px 5px 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-top-color: transparent !important;
      top: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^="right"] {
    margin-left: 5px;

    .tooltip-arrow {
      border-width: 5px 5px 5px 0;
      border-left-color: transparent !important;
      border-top-color: transparent !important;
      border-bottom-color: transparent !important;
      left: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &[x-placement^="left"] {
    margin-right: 5px;

    .tooltip-arrow {
      border-width: 5px 0 5px 5px;
      border-top-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      right: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &.popover {
    $color: #f9f9f9;

    .popover-inner {
      background: $color;
      color: black;
      padding: 24px;
      border-radius: 5px;
      box-shadow: 0 5px 30px rgba(black, .1);
    }

    .popover-arrow {
      border-color: $color;
    }
  }

  &[aria-hidden='true'] {
    visibility: hidden;
    opacity: 0;
    transition: opacity .15s, visibility .15s;
  }

  &[aria-hidden='false'] {
    visibility: visible;
    opacity: 1;
    transition: opacity .15s;
  }
}

.notices .toast {
  border-radius: 8px!important;
}

#app .navbar-item.has-dropdown .navbar-link {
  color: #fff;
}

#app .navbar-item.has-dropdown:hover .navbar-link {
  background-color: transparent;
}

#app .navbar-dropdown {
  background-color: rgba(0,0,0,0.9);
  border-top: none;
}

#app .tabs ul li a {
  color: #fff;
}

#app .tabs ul li.is-active a {
  color: $primary;
}

#app .site-down {
  position: absolute;
  top: 50%;
  margin-top: -200px;
  width: 100%;
  img {
    width: 200px;
    height: 200px;
  }
}

#rv.login {
  margin-right: 0;
  padding: 2rem;
}

html {
  background-color: $dark-blue;
  background-image: radial-gradient(#263277, $dark-blue);
  min-height: 99vh;
  width: 98vw;
}

.notification .is-warning {
  margin: 1rem 1rem 1rem 2rem;
}

body {
  color: #fff;
}

ol {
  margin-left: 2rem;
}

section {
  background-color: rgba(255,255,255,0.1);
  margin-bottom: 1rem;
  padding: 1rem;
}

#app .b-table .table tr.detail {
  background: none!important;
}

.has-pointer {
  cursor: pointer;
}

.big-number {
  font-size: 3rem;
  line-height: 1.5rem;
  img {
    max-height: 4rem;
  }
}

.roster-view {
  h2 {
    max-width: 150px;
  }
}

.league-message {
  blockquote {
    margin-top: 1rem;
    background-color: rgba(0,0,0,0.4);
  }
  ol {
    padding: 2rem 3rem;
  }
}

.mdi-chevron-right:before {
  content: ">";
}

.mdi-chevron-left:before {
  content: "<";
}

label.label {
  color: #fff;
}

label.b-checkbox {
  line-height: 36px;
}

input.input {
  opacity: .6;
  &:hover, &:focus, &:active {
    opacity: 1;
  }
}

.article ul li {
  list-style-type: circle;
  margin-left: 2rem;
}

.box {
  background-color: transparent;
  color: #fff;
}

.checkbox:hover {
  color: #fff;
}

.button.is-primary {
  background-color: $primary;
  text-shadow: 1px 1px rgba(0,0,0,0.5);
  font-weight: 500;
}

.button.is-secondary {
  background-color: $secondary;
  font-weight: 500;
  color: #fff;
  border: none;
}

.mockup {
  color: #fff;
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 4px;
  margin: 4px;
  padding: 4px;
}

.main-menu ul li a.router-link-active {
  color: $primary;
}

.pagination-link {
  background-color: #fff;
}

.pagination-next, .pagination-previous {
  background-color: $secondary;
  color: #fff;
}

table.table {
  background-color: rgba(0,0,0,0.4);
  color: #fff;
  td {
    border-color: $primary;
  }
  thead th {
    color: #fff;
    border-width: 0 0 1px;
  }
}

a:hover {
  color: $primary;
  border-bottom: 1px dotted $primary;
}

.ow-font {
  font-family: 'overFont';
}

.title-font {
  font-family: 'titleFont';
  color: #fff;
  text-transform: uppercase;
}

.wrap {
  color: $white;
}

.orange {
  color: $primary;
}

.white {
  color: $white;
}

.is-left-menu {
  border-right: 1px solid rgba(255,255,255,0.3);
  min-height: 100vh;
}

.is-mice {
  font-size: .7rem;
}

.is-proper {
  text-transform: capitalize;
}

.is-button-header {
  h1, h2 {
    padding-left: .25rem;
  }
  .column {
    padding: 0;
    .button {
      display: block;
      height: 1.6rem;
      line-height: 1.6rem;
      border-radius: 0;
      font-size: 1rem;
    }
  }
  .column.is-narrow {
    background-color: $primary;
  }
}

h1 {
  font-family: 'overFont';
  font-size: 2rem;
  color: #fff;
  .button {
    margin-top: .7rem;
  }
}

h2 {
  font-family: 'overFont';
  font-size: 1.6rem;
  color: #fff;
  .button {
    margin-top: .5rem;
  }
}

h3 {
  font-family: 'overFont';
  font-size: 1.4rem;
  color: #fff;
}

p {
  margin-top: 1rem;
}

strong {
  color: #fff;
}

hr {
  opacity: .5;
  height: 1px;
}

/* overrides */
#app {
  .button {
    border-radius: 0;
  }
}
</style>
