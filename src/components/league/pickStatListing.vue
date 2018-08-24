<template lang="pug">
  .pick-stat-listing
    .spacer
    .box(v-if="pick")
      .wrap(v-if="pick.oldMatchup")
        .team-pick-name.clickable(v-on:click="visible = !visible")
          p.match-date.is-pulled-right.is-hidden-mobile {{ pick.oldMatchup.startDate | formatDate }}
          h3.overwatch-font
            span.orange-text.is-hidden-mobile {{ pick.oldMatchup.homeTeamName }}
            span.orange-text.is-hidden-desktop {{ pick.oldMatchup.homeTeamShortName }}
            | vs
            span.orange-text.is-hidden-desktop {{ pick.oldMatchup.awayTeamShortName }}
            span.orange-text.is-hidden-mobile {{ pick.oldMatchup.awayTeamName }}
            |  - {{ pick.myPick.points || 0 }} pts
        a.button.positive-button(v-bind:href="leaguePickUrl") View League Picks For Matchup
        table.table.is-fullwidth.is-striped.owp-orange-border(v-show="visible")
          thead
            tr
              th &nbsp;
              th You
              th.is-hidden-mobile Actual
              th Pts
          tbody
            tr
              td Overall
              td(v-if="pick.myPick.winner == pick.oldMatchup.homeTeamId")
                img.small-logo(v-bind:src="pick.oldMatchup.homeLogoUrl")
              td(v-else)
                img.small-logo(v-bind:src="pick.oldMatchup.awayLogoUrl")
              td.is-hidden-mobile(v-if="pick.oldMatchup.matchWinner == pick.oldMatchup.homeTeamId")
                img.small-logo(v-bind:src="pick.oldMatchup.homeLogoUrl")
              td.is-hidden-mobile(v-else-if="pick.oldMatchup.matchWinner == pick.oldMatchup.awayTeamId")
                img.small-logo(v-bind:src="pick.oldMatchup.awayLogoUrl")
              td.is-hidden-mobile(v-else) N/A
              td(v-if="pick.myPick.winner == pick.oldMatchup.matchWinner") 400
              td(v-else) 0
            tr
              td {{pick.oldMatchup.homeTeamShortName }}
              td.score-pad
                span {{ pick.myPick.homeScore }}
              td.score-pad.is-hidden-mobile
                span {{ pick.oldMatchup.homeScore || 0 }}
              td(v-if="pick.myPick.homeScore == pick.oldMatchup.homeScore") 50
              td(v-else) 0
            tr
              td {{pick.oldMatchup.awayTeamShortName }}
              td.score-pad
                span {{ pick.myPick.awayScore }}
              td.score-pad.is-hidden-mobile
                span {{ pick.oldMatchup.awayScore || 0 }}
              td(v-if="pick.myPick.awayScore == pick.oldMatchup.awayScore") 50
              td(v-else) 0
            tr(v-for="(map, index) in pick.myPick.maps" v-if="!leagueData.simpleMode && pick.oldMatchup.maps[index]")
              td {{ pick.oldMatchup.maps[index].type }}
              td(v-if="map.winner == pick.oldMatchup.homeTeamName")
                img.small-logo(v-bind:src="pick.oldMatchup.homeLogoUrl")
              td(v-else)
                img.small-logo(v-bind:src="pick.oldMatchup.awayLogoUrl")
              td.is-hidden-mobile(v-if="pick.oldMatchup.maps[index].winner == pick.oldMatchup.homeTeamName")
                img.small-logo(v-bind:src="pick.oldMatchup.homeLogoUrl")
              td.is-hidden-mobile(v-else-if="pick.oldMatchup.maps[index].winner == pick.oldMatchup.awayTeamName")
                img.small-logo(v-bind:src="pick.oldMatchup.awayLogoUrl")
              td.is-hidden-mobile(v-else-if="pick.oldMatchup.maps[index].winner == 'Draw'")
                img.small-logo(src="/assets/img/tie.svg" alt="Draw")
              td.is-hidden-mobile(v-else) N/A
              td(v-if="map.winner == pick.oldMatchup.maps[index].winner") 100
              td(v-else) 0
            tr(v-if="pick.oldMatchup.tieWinner && !leagueData.simpleMode")
              td Tie
              td(v-if="pick.myPick.tieWinner == pick.oldMatchup.homeTeamName")
                img.small-logo(v-bind:src="pick.oldMatchup.homeLogoUrl")
              td(v-if="pick.myPick.tieWinner == pick.oldMatchup.awayTeamName")
                img.small-logo(v-bind:src="pick.oldMatchup.awayLogoUrl")
              td(v-if="pick.myPick.tieWinner == 'none'")
                img.small-logo(src="/assets/img/tie.svg" alt="none")
              td.is-hidden-mobile(v-if="pick.oldMatchup.tieWinner == pick.oldMatchup.homeTeamName")
                img.small-logo(v-bind:src="pick.oldMatchup.homeLogoUrl")
              td.is-hidden-mobile(v-if="pick.oldMatchup.tieWinner == pick.oldMatchup.awayTeamName")
                img.small-logo(v-bind:src="pick.oldMatchup.awayLogoUrl")
              td.is-hidden-mobile(v-if="pick.oldMatchup.tieWinner == 'none'")
                img.small-logo(src="/assets/img/tie.svg" alt="none")
              td(v-if="pick.myPick.tieWinner == pick.oldMatchup.tieWinner") 100
              td(v-else) 0
      .wrap(v-else)
        p We aren't able to get the data for this matchup.
</template>

<script>
export default {
  name: 'pick-stat-listing',
  props: [
    'pick', 'leagueData'
  ],
  data () {
    return {
      visible: false
    }
  },
  computed: {
    leaguePickUrl: function () {
      return '/#/LeaguePicks/' + this.pick.myPick.leagueId + '/' + this.pick.myPick.matchId
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../variables.scss';
  .score-pad {
    span {
      padding-left: .7rem;
    }
  }
  p.match-date {
    padding: 0;
    margin: 0;
  }
  .small-logo {
    height: 2rem;
    width: auto;
  }
  .team-pick-name {
    img {
      height: 4rem;
      width: auto;
      display: inline-block;
      padding: 0 .5rem;
    }
  }
  .team-name {
    img {
      height: 2rem;
      width: auto;
      display: inline-block;
      margin-bottom: -0.2rem;
      padding: 0 .5rem;
    }
    .team-rank {
      color: $owp-orange;
    }
    display: block;
    font-size: 2rem;
    font-family: 'overFont'
  }
</style>
