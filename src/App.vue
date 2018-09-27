<template lang="pug">
  #app
    router-view#rv
    main-menu
</template>

<script>
import mainMenu from '@/components/Menu'

export default {
  name: 'HighNoon',
  components: {
    mainMenu
  }
}
</script>

<style lang="scss">
// Import Bulma's core
@import "~bulma/sass/utilities/_all";

// Set your colors
$primary: #f99e1a;
$primary-invert: findColorInvert($primary);
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

.box {
  background-color: transparent;
  color: #fff;
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
