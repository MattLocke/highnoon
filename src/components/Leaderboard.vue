<template lang="pug">
  .leaderboard
    .container
      section.section
        .box.kill-overflow
          h1.text-border GLOBAL RANKINGS
          .spacer
          competitionLeaderboard

</template>

<script>
import competitionLeaderboard from '@/components/leaderboard/CompetitionLeaderboard'

export default {
  name: 'competition-leaderboard',
  components: {
    competitionLeaderboard
  },
  data () {
    return {
    }
  },
  methods: {
  },
  mounted: function () {
  }
}
</script>

<style>
  .kill-overflow {
    overflow: hidden;
  }
</style>
