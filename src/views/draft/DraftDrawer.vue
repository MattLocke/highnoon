<template lang="pug">
  .draft-drawer.has-text-centered
    .columns.is-mobile.is-multiline.is-marginless
      .column
      .column.is-narrow
        h4.orange.ow-font Your Picks - {{ roster.length }} of 12
      .column.is-narrow(v-for="player in roster")
        img.role-image(:src="`images/roles/${player.attributes.role || 'flex'}-white.svg`")
        span.ow-font {{ player.name }}
      .column
</template>

<script>
export default {
  name: 'draftDrawer',
  props: {
    roster: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss">
.draft-drawer {
  position: fixed;
  transform: translate3d(0, 0, 0);
  bottom: 0;
  background-color: rgba(0,0,0,0.8);
  width: 100%;
  .role-image {
    height: 18px;
    width: auto;
    margin-bottom: -3px;
  }
}
</style>
