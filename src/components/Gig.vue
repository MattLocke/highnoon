<template lang="pug">
  .stats
    section.section
      .container.is-fluid
        .box
          h2.text-border Pick Rates For Gig
          table.table.is-fullwidth.is-striped.owp-orange-border
            thead
              tr
                th Stage
                th Week
                th H
                th Score
                th H%
                th H4-0%
                th H3-1%
                th A
                th Score
                th A%
                th A4-0%
                th A3-1%
                th Picks
                th Map1
                th M1W
                th Map2
                th M2W
                th Map3
                th M3W
                th Map4
                th M4W
                th TieW
                th Winner
            tbody
              tr(v-for="match in matches")
                td {{ match.stage }}
                td {{ match.week }}
                td {{ match.homeShortName }}
                td {{ match.homeScore }}
                td {{ match.homePercent }}
                td {{ match.homeSweepPercent }}
                td {{ match.homeThreeOnePercent }}
                td {{ match.awayShortName }}
                td {{ match.awayScore }}
                td {{ match.awayPercent }}
                td {{ match.awaySweepPercent }}
                td {{ match.awayThreeOnePercent }}
                td {{ match.totalCount }}
                td {{ match.maps[0].name }}
                td {{ mapWinner(match, match.maps[0].winner) }}
                td {{ match.maps[1].name }}
                td {{ mapWinner(match, match.maps[1].winner) }}
                td {{ match.maps[2].name }}
                td {{ mapWinner(match, match.maps[2].winner) }}
                td {{ match.maps[3].name }}
                td {{ mapWinner(match, match.maps[3].winner) }}
                td {{ mapWinner(match, match.tieWinner) }}
                td {{ matchWinner(match) }}
</template>

<script>
import fireStats from '@/services/stats'
import fireMatch from '@/services/match'

export default {
  name: 'gig',
  data () {
    return {
      matches: [],
      leagueData: {
        competitionId: 'gleuqAnpFrtKZo2zpjmu'
      }
    }
  },
  methods: {
    matchWinner: function (match) {
      if (match.winner === match.homeTeamId) return match.homeShortName
      else if (match.winner === match.awayTeamId) return match.awayShortName
      else return 'N/A'
    },
    mapWinner: function (match, mapWinner) {
      if (match.homeTeamName === mapWinner) return match.homeShortName
      else if (match.awayTeamName === mapWinner) return match.awayShortName
      else return 'N/A'
    },
    getPicks: function () {
      var _this = this
      fireStats.getAllMatchPickPercents().then(function (matches) {
        fireMatch.getAllLeagueMatches(_this.leagueData.competitionId).then(function (results) {
          matches.forEach(function (match) {
            let obj = results.find(x => x.id === match.matchId)
            if (obj) {
              match.winner = obj.matchWinner
              match.awayScore = obj.awayScore
              match.homeScore = obj.homeScore
              match.homeTeamId = obj.homeTeamId
              match.awayTeamId = obj.awayTeamId
              match.homeTeamName = obj.homeTeamName
              match.awayTeamName = obj.awayTeamName
              match.tieWinner = obj.tieWinner
              match.maps = obj.maps
            } else {
              console.log('No match found for: ', match.matchId)
            }
          })
          _this.matches = matches
        })
      })
    }
  },
  mounted: function () {
    this.getPicks()
  }
}
</script>

<style lang="scss" scoped>
  @import '../variables.scss';
  .match-date {
    background-color: $owp-orange;
    color: #fff;
    padding: .2rem;
    border-radius: 4px 4px 0 0;
    text-align: center;
    span {
      font-size: 1.6rem!important;
    }
  }
  .pick-wrap {
    display: inline-block;
    width: 30%;
    margin-left: 2.5%;
  }
  .match-box {
    border: 1px solid $owp-dkgrey;
    border-radius: 4px;
    margin-bottom: 1rem;
    padding: 8px;
  }
  .is-mobile {
    width: 100%;
    margin-left: 0;
  }
  .titles {
    margin-bottom: -26px;
    padding: 0 .2rem;
  }
  .count p {
    font-size: .8rem;
  }
  .homeTeamColor {
    width: 100%;
    height: 4rem;
    background-color: #d22630;
    position: relative;
    overflow: hidden;
    border-radius: 4px;
  }
  .awayTeamColor {
    width: 100%;
    height: 4rem;
    background-color: #381460;
    position: relative;
  }
  .chart {
    margin-top: .8rem;
  }
  .stats {
    img {
      height: 2rem;
      width: auto;
      margin-bottom: -.2rem;
    }
    span {
      font-size: 2rem;
      line-height: 2rem;
    }
  }
</style>
