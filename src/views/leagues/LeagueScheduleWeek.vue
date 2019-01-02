<template lang="pug">
  .league-schedule-week
    h3 Week {{ index + 1 }}
    div(v-for="match in week")
      span {{ match.home.displayName }} vs {{ match.away.displayName }}
</template>

<script>
export default {
  props: {
    index: {
      type: Number,
      required: true
    },
    week: {
      type: Array,
      required: true
    }
  }
}
</script>
