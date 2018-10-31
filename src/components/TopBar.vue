<template lang="pug">
  .top-bar.is-hidden-desktop(:class="getClass")
    slot(v-if="!isCollapsed")
    .close-bar(@click="toggleMenu")
</template>

<script>
export default {
  name: 'TopBar',
  data () {
    return {
      isCollapsed: true
    }
  },
  computed: {
    getClass () {
      return this.isCollapsed ? { 'is-closed': true } : { 'is-open': true }
    }
  },
  methods: {
    toggleMenu () {
      this.isCollapsed = !this.isCollapsed
      console.log(`Should be: ${this.isCollapsed}`)
    }
  }
}
</script>

<style lang="scss" scoped>
  .close-bar {
    height: 2vh;
    background-color: #000;
    cursor: pointer;
    margin-bottom: .5rem;
    border-bottom: 1px solid rgba(255,255,255,0.5);
  }
  .top-bar {
    margin-top: 1.5rem;
  }
  .top-bar.is-closed {
    margin-top: 0;
  }
  .is-open {
    animation-name: opening;
    height: 100vh;
    width: 100vw;
    animation-duration: .5s;
    position: absolute;
    z-index: 999;
    background-color: rgba(0,0,0,0.95);
    .close-bar {
      position: fixed;
      bottom: 0;
      width: 100vw;
    }
  }
  .is-closed {
    animation-name: closing;
    animation-duration: .5s;
    height: 2vh;
  }
  @keyframes opening {
    from { height: 2vh; }
    to { height: 100vh; }
  }
  @keyframes closing {
    from { height: 100vh; }
    to { height: 2vh; }
  }
</style>
