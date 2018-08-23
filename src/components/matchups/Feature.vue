<template lang="pug">
  .feature.box
    h1.title.text-border Apex Season 4 - Week 9
    .box
      .columns.is-mobile
        .column.centered
          h3.header-font.is-hidden-touch {{ homeTeam }}
          h3.header-font.is-hidden-desktop {{ homeShort }}
          img.matchup-logo(v-bind:src="homeTeamLogo")
          button.button.positive-button.full-width WINS
        .column.centered
          img.vs-logo(src="/static/img/vs.png")
          hr
          label.score Score: 
          select.select.is-large
            option(v-for="matchoption in matchscore") {{ matchoption }}
        .column.centered
          h3.header-font.is-hidden-touch {{ awayTeam }}
          h3.header-font.is-hidden-desktop {{ awayShort }}
          img.matchup-logo(v-bind:src="awayTeamLogo")
          button.button.negative-button.full-width LOSES
    .box
      p Something clever about the matchup. (stats/etc)
</template>

<script>
  export default {
    name: 'feature',
    props: ['homeTeam', 'awayTeam', 'homeTeamLogo', 'awayTeamLogo'],
    data () {
      return {
        startingNumber: 7,
        homeShort: 'FLM',
        awayShort: 'PHF'
      }
    },
    computed: {
      matchscore: function () {
        var options = []

        // setting this to the 3 most common matchups, using static values for now.
        options[3] = [
          '2-0',
          '2-1',
          '3-2',
          '2-3',
          '1-2',
          '0-2',
          'Draw'
        ]

        options[5] = [
          '3-0',
          '3-1',
          '3-2',
          '4-3',
          '3-4',
          '2-3',
          '1-3',
          '0-3',
          'Draw'
        ]

        options[7] = [
          '4-0',
          '4-1',
          '4-2',
          '4-3',
          '5-4',
          '4-5',
          '3-4',
          '2-4',
          '1-4',
          '0-4',
          'Draw'
        ]
        return options[this.startingNumber]
      }
    }
  }
</script>

<style>
  .vs-logo {
    display: block;
    margin: auto;
  }
  .score {
    display: block;
  }
</style>