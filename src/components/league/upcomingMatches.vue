<template lang="pug">
  .upcoming-matches
    a.button.negative-button.is-small.is-pulled-right(v-on:click="showMatches = true" v-if="!showMatches") show matches
    a.button.negative-button.is-small.is-pulled-right(v-on:click="showMatches = false" v-if="showMatches") collapse
    .is-clearfix(v-if="!showMatches")
    .wrap(v-if="showMatches")
      h2.text-border Upcoming Matches
      .spacer
      .matches(v-if="sortedMatchups.length")
        .columns.is-desktop(v-for="i in Math.ceil(matchups.length / 4)")
          .column.is-one-quarter-desktop(v-for="match in sortedMatchups.slice((i-1) * 4, i * 4)")
            .mini-match
              span.start-time
                h3.overwatch-font {{ match.startDate | formatDate }}
              span.team-name
                span.team-rank {{ match.homeRecord }}
                img(v-bind:src="match.homeLogoUrl")
                |  {{ match.homeTeamShortName }} 
                span.vs vs
                span.team-rank {{ match.awayRecord }}
                |  {{ match.awayTeamShortName }}
                img(v-bind:src="match.awayLogoUrl")
              .validMatch(v-if="!match.isLocked && verified")
                a.button.positive-button.full-width(v-bind:href="upcomingMatchUrl(match.id, match.numMaps)" v-if="!match.hasPick") Pick 'em
                a.button.disabled-button.full-width(v-else v-bind:href="editPickUrl(match.id, match.numMaps, match.pickId)") Edit Pick
              .invalidMatch(v-else)
                a.button.disabled-button.full-width Match Locked
      .box(v-else)
        p There are currently no picks available.  If the week just ended, be sure to check back on Sunday!
</template>

<script>
  export default {
    name: 'upcoming-matches',
    props: [
      'matchups', 'verified', 'leagueId'
    ],
    data () {
      return {
        showMatches: true
      }
    },
    computed: {
      sortedMatchups: function () {
        var sorted = this.matchups.slice(0)
        return sorted.sort(function (a, b) { return (a.startDate > b.startDate) ? 1 : ((b.startDate > a.startDate) ? -1 : 0) })
      }
    },
    methods: {
      upcomingMatchUrl: function (matchupId, numMaps) {
        return '/#/Matchup/' + numMaps + '/' + this.leagueId + '/' + matchupId
      },
      editPickUrl: function (matchupId, numMaps, pickId) {
        return '/#/Matchup/' + numMaps + '/' + this.leagueId + '/' + matchupId + '/' + pickId
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../variables.scss';
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
  .mini-match {
    border: 1px solid #ccc;
    border-radius: 8px;
    text-align: center;
    overflow: hidden;
    .start-time {
      color: #fff;
      h3 {
        background-color: $owp-dkblue;
      }
    }
  }
</style>