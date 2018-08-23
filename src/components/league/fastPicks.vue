<template lang="pug">
  .fast-pick
    h2.text-border Your Picks
      span.button.is-small.negative-button.is-pulled-right(v-if="showPicks", v-on:click="showPicks = false") collapse
      span.button.is-small.positive-button.is-pulled-right(v-else, v-on:click="showPicks = true") show picks
    .wrap(v-show="showPicks")
      .columns
        .column.centered
          .field
            label.checkbox
              input(type="checkbox" v-model="showPoints")
              |  Show Points
        .column.centered
          .field
            label.checkbox
              input(type="checkbox" v-model="autoWinner")
              |  Set winner to higher score.
        .column.centered
          .field
            label.checkbox
              input(type="checkbox" v-model="seeAllPicks")
              |   See All Picks
      fast-pick-listing(v-for="pick in matchups" :key="pick.id" :match="pick" :showPoints="showPoints" :autoWinner="autoWinner", :leagueInfo="leagueData", :leagueId="leagueId", :userId="userId", :seeAllPicks="seeAllPicks")
</template>

<script>
  import fastPickListing from '@/components/league/fastPicksListing'

  export default {
    name: 'fastPick',
    components: {
      fastPickListing
    },
    props: [
      'matchups',
      'verified',
      'leagueId',
      'leagueData',
      'userId'
    ],
    data () {
      return {
        showPicks: false,
        showPoints: false,
        autoWinner: true,
        seeAllPicks: false
      }
    },
    mounted: function () {
    }
  }
</script>

<style lang="scss" scoped>
  h2 span.button {
    font-family: BlinkMacSystemFont, -apple-system, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  }
</style>