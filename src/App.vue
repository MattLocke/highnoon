<template lang="pug">
  #app
    main-menu
    b-loading(:is-full-page="true" :active.sync="isLoading" :can-cancel="false")
    router-view#rv
</template>

<script>
import firebase from 'firebase/app'

import userService from '@/services/user'

import mainMenu from '@/components/Menu'

export default {
  name: 'HighNoon',
  components: {
    mainMenu
  },
  computed: {
    isLoading () {
      return this.$store.getters.loading
    }
  },
  mounted () {
    this.$store.dispatch('saveFireData', firebase.auth().currentUser)
    this.$store.dispatch('loadConfig')
    this.$store.dispatch('setLoading', true)

    if (firebase.auth().currentUser) {
      userService.getProfile(firebase.auth().currentUser.uid)
        .then(userData => {
          this.$store.dispatch('logIn', userData)
          this.$store.dispatch('setLoading', false)
        })
    } else this.$store.dispatch('setLoading', false)
  }
}
</script>

<style lang="scss">
// Import Bulma's core
@import "~bulma/sass/utilities/_all";

// Set your colors
$primary: #f99e1a;
$primary-invert: findColorInvert($primary);
$secondary: #0a0d1e;
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
#rv.login {
  margin-right: 0;
  padding: 2rem;
}

html {
  background-color: $dark-blue;
  background-image: radial-gradient(#263277, $dark-blue);
  min-height: 99vh;
}

body {
  color: #fff;
}

section {
  background-color: rgba(255,255,255,0.1);
  margin-bottom: 1rem;
  padding: 1rem;
}

.has-pointer {
  cursor: pointer;
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

h1 {
  font-family: 'overFont';
  font-size: 2rem;
  color: #fff;
}

h2 {
  font-family: 'overFont';
  font-size: 1.6rem;
  color: #fff;
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
</style>
