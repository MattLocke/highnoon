<template lang="pug">
  .wrap.hamburger-menu
    eva-icon.has-pointer(name="more-horizotnal" fill="white" @click="showContent = !showContent")
    transition(name="scale")
      .hamburger-content(v-if="showContent")
        slot
</template>

<script>
export default {
  name: 'HamburgerMenu',
  data () {
    return {
      showContent: false
    }
  }
}
</script>

<style lang="scss">
  .hamburger-menu {
    position: relative;
    width: auto;
  }
  .hamburger-content {
    position: absolute;
    border-radius: 2px;
    left: 2em;
    bottom: 2em;
    padding: 8px;
    background-color: white;
    z-index: 2;
  }
  .scale-enter-active, .scale-leave-active {
    transition: transform .25s;
    transform-origin: bottom left;
  }
  .scale-enter, .scale-leave-to /* .fade-leave-active below version 2.1.8 */ {
    transform: scale(0);
    transform-origin: bottom left;
  }
</style>
