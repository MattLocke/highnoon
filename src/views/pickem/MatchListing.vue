<template lang="pug">
  .match-listing
    .columns.is-gapless.is-mobile
      .column.is-narrow
        img(:src="`images/teams/${match.competitors[0].abbreviatedName}.svg`" width="28")
      .column.is-narrow
        .ow-font.team-name {{ match.competitors[0].abbreviatedName }}
      .column.is-narrow
        b-checkbox.is-pulled-right(:disabled="isDisabled")
      .column.has-text-centered
        .match-date {{ match.startDateTS | formatJSDate }}
        .match-time {{ match.startDateTS | formatJSTime }}
      .column.is-narrow
        b-checkbox(:disabled="isDisabled")
      .column.is-narrow
        .ow-font.team-name.is-pulled-right {{ match.competitors[1].abbreviatedName }}
      .column.is-narrow
        img(:src="`images/teams/${match.competitors[1].abbreviatedName}.svg`" width="22" height="22")
</template>

<script>
export default {
  name: 'MatchListing',
  props: {
    match: {
      type: Object,
      required: true
    }
  },
  computed: {
    isDisabled () {
      const now = Date.now()
      return (this.match.startDateTS < now)
    }
  }
}
</script>

<style lang="scss">
.match-listing {
  background-color: rgba(255,255,255,0.1);
  margin-bottom: .25rem;
  padding: .25rem;
  .team-name {
    width: 32px;
  }
  .b-checkbox.checkbox {
    margin-top: .35rem;
  }
  .match-date {
    font-size: .75rem;
    display: block;
  }
  .match-time {
    display: block;
    font-size: .6rem;
  }
  img {
    margin: 0 .5rem -.75rem .5rem;
  }
}
</style>
