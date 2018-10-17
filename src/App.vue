<template lang="pug">
  #app
    router-view#rv
    main-menu
    b-loading(:is-full-page="true" :active.sync="isLoading" :can-cancel="false")
</template>

<script>
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
  }
}
</script>

<style lang="scss">
// Import Bulma's core
@import "~bulma/sass/utilities/_all";

// Set your colors
$primary: #f99e1a;
$primary-invert: findColorInvert($primary);
$secondary: #0000f3;
$twitter: #4099FF;
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

#rv {
  margin-right: 3vw;
}

html {
  background-color: #090c1c;
}

section {
  background-color: rgba(255,255,255,0.1);
  margin-bottom: 1rem;
  padding: 1rem;
}

label.label {
  color: #fff;
}

.box {
  background-color: transparent;
  color: #fff;
}

.button.is-primary {
  background-color: $primary;
}

.button.is-secondary {
  background-color: $secondary;
  color: #fff;
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
  color: light($primary, 20%);
}

.ow-font {
  font-family: 'overFont';
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

.is-proper {
  text-transform: capitalize;
}

h1 {
  font-family: 'overFont';
  font-size: 2rem;
}

h2 {
  font-family: 'overFont';
  font-size: 1.6rem;
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
