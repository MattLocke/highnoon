<template lang="pug">
  .team-slot
    .mockup
      .columns
        .column
          h1 {{ roleType }}
        .column.is-narrow
          a.button.is-primary.is-small View Heroes
        .column.is-narrow
          a.button.is-primary.is-small View Players
</template>

<script>
export default {
  data () {
    return {
      teamName: 'Shock',
      viewHeroes: false,
      viewPlayers: false
    }
  },
  props: {
    roleType: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
  a.button {
    margin-top: 10px;
  }
</style>
