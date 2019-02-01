<template lang="pug">
  .left-bar(:class="getClass")
    p.show-menu.orange.is-hidden-desktop(@click="showMenu = !showMenu") {{ showMenu ? 'Hide' : 'Show' }} Menu
      arrow(:isLeft="true" v-model="showMenu")
    .wrap(v-if="showMenu")
      slot
</template>

<script>
export default {
  data () {
    return {
      showMenu: true
    }
  },
  props: {
    embedded: {
      type: Boolean,
      default: false
    },
    hideMobile: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    getClass () {
      if (this.embedded) return {}
      return { 'column': true, 'is-one-quarter-desktop': true, 'is-hidden-mobile': this.hideMobile }
    }
  }
}
</script>

<style lang="scss">
  .left-bar {
    .show-menu {
      margin-bottom: .5rem;
    }
    .logo {
      height: 20px;
      width: auto;
    }
    h2 {
      color: #fff;
    }
    .left-bar-item {
      background-color: rgba(255,255,255,0.1);
      margin-bottom: .25rem;
      padding: .5rem 1rem;
    }
    .left-bar-item.active-item {
      background-color: #f99e1a;
    }
    .left-bar-item.has-pointer:hover {
      border-right: 2px solid #f99e1a;
    }
  }
  .left-bar.is-always-open {
    padding-top: .75rem;
  }
  .is-one-quarter, .openedParent {
    animation-name: opening;
    width: 25vw;
    animation-duration: .2s;
  }
  .is-narrow, .closedParent {
    animation-name: closing;
    animation-duration: .2s;
  }
  @keyframes opening {
    from { width: 2vw; }
    to { width: 25vw; }
  }
  @keyframes closing {
    from { width: 15vw; }
    to { width: 2vw; }
  }
</style>
