<template lang="pug">
  .map
    .box(v-for="mapType in mapTypes")
      h2.overwatch-font.text-border {{ mapType }}
      .columns
        .column
          .match-option
            label.label Winner:
            select.select.is-large
              option {{ homeTeam }}
              option {{ awayTeam }}
              option Draw
        .column
          .match-option
            label.label Round Score:
            select(v-if="mapType == 'Assault'").select.is-large
              option 2-0
              option 2-1
              option 3-2
            select(v-if="mapType == 'Control'").select.is-large
              option 2-0
              option 2-1
              option 3-2
            select(v-if="mapType == 'Hybrid'").select.is-large
              option 2-0
              option 2-1
              option 3-2
            select(v-if="mapType == 'Escort'").select.is-large
              option 2-0
              option 2-1
              option 3-2
        .column
          .match-option
            label.label Extra Round?:
            select.select.is-large
              option No
              option Yes
        .column
          .match-option
            label.label Play of the Game:
            select.select.is-large
              option {{ homeTeam }}
              option {{ awayTeam }}
</template>

<script>
export default {
  name: 'map',
  props: ['homeTeam', 'awayTeam', 'mapTypes'],
  data () {
    return {
    }
  }
}
</script>

<style lang="scss">
  .matchup-logo {
    height: 128px;
    width: auto;
    display: block;
    margin: auto;
  }
  .match-option {
    padding-top: .75rem;
    text-align: center;
    .label {
      font-weight: normal;
      margin-bottom: 0;
    }
  }
  .box {
    margin-bottom: 1.5rem!important;
  }
</style>
