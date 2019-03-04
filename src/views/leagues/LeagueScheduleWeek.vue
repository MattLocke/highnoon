<template lang="pug">
  .league-schedule-week
    h3(:class="{'orange': currentWeek}") Week {{ index }}
    div(v-for="match in week")
      span(:class="{'orange': match.home.userId == userId}") {{ match.home.displayName }}
      span  vs
      span(:class="{'orange': match.away.userId == userId}")  {{ match.away.displayName }}
</template>

<script>
export default {
  props: {
    index: {
      type: [Number, String],
      required: true
    },
    week: {
      type: Array,
      required: true
    },
    currentWeek: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    userId () {
      return this.$store.getters.getUserId
    }
  }
}
</script>
