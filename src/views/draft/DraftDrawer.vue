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
