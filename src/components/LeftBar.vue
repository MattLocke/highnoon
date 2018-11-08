<template lang="pug">
  .left-bar.column.is-hidden-mobile(:class="getClass")
    .columns.is-mobile
      .column
        router-link(to="/home")
          h2(v-if="isOpen")
            img.logo(src="images/high_noon_white.svg")
            |  HIGHNOON
            span.orange .GG
      .column.is-narrow(@click="isOpen = !isOpen")
        burger(v-model="isOpen")
    slot(v-if="isOpen")
</template>

<script>
export default {
  data () {
    return {
      isOpen: true
    }
  },
  computed: {
    getClass () {
      return this.isOpen ? { 'is-one-quarter': true } : { 'is-narrow': true }
    }
  }
}
</script>

<style lang="scss" scoped>
  .left-bar {
    padding-top: 1.5rem;
    .logo {
      height: 20px;
      width: auto;
    }
    h2 {
      color: #fff;
    }
  }
  .is-one-quarter, .openedParent {
    animation-name: opening;
    width: 25vw;
    animation-duration: .2s;
  }
  .is-narrow, .closedParent {
    animation-name: closing;
    animation-duration: .2s;
    width: 2vw;
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
