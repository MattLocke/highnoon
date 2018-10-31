<template lang="pug">
  .left-bar.column(v-bind:class="getClass()")
    .columns
      .column
      .column.is-narrow
        burger(v-model="isCollapsed" :starts-open="true")
    slot(v-if="!isCollapsed")
</template>

<script>
export default {
  data () {
    return {
      isCollapsed: false
    }
  },
  methods: {
    getClass () {
      return this.isCollapsed ? { 'is-narrow': true } : { 'is-one-quarter': true }
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
    animation-duration: .5s;
  }
  .is-narrow, .closedParent {
    animation-name: closing;
    animation-duration: .5s;
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
