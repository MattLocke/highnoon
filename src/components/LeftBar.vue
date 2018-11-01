<template lang="pug">
  .left-bar.column.is-hidden-mobile(:class="getClass")
    .columns.is-mobile
      .column
      .column.is-narrow
        burger(v-model="isOpen" :starts-open="true")
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
