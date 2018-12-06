<template lang="pug">
  .top-bar.is-hidden-tablet(:class="getClass" @click="toggleMenu")
    slot(v-if="!isCollapsed")
    .close-bar
      .close-text(v-if="isCollapsed")
        span {{ toggleText }}
</template>

<script>
export default {
  name: 'TopBar',
  props: {
    toggleText: {
      type: String,
      required: true
    }
  },
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
    }
  }
}
</script>

<style lang="scss" scoped>
  .close-bar {
    height: 4vh;
    background-color: #000;
    cursor: pointer;
    border-top: 1px solid rgba(255,255,255,0.5);
    position: fixed;
    bottom: 0;
    z-index: 900;
    width: 100vw;
    .close-text {
      text-align: center;
      span {
        background-color: #000;
        padding: 0 .25rem;
        color: #f99e1a;
        font-size: .7rem;
      }
    }
  }
  .top-bar {
    margin-top: 1.5rem;
  }
  .top-bar.is-closed {
    margin-top: 0;
  }
  .is-open {
    animation-name: opening;
    min-height: 98vh;
    width: 100vw;
    animation-duration: .2s;
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
    animation-duration: .2s;
    height: 2vh;
  }
  @keyframes opening {
    from { height: 2vh; }
    to { height: 98vh; }
  }
  @keyframes closing {
    from { height: 98vh; }
    to { height: 2vh; }
  }
</style>
