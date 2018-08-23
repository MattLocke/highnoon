<template lang="pug">
  .pick-rates
    .wrap(v-if="pickDetails && pickDetails.awayName")
      h2.text-border Global Pick Rates
      .global
        .chart
          .homeTeamColor(v-bind:style="{ backgroundColor: pickDetails.homeColor }")
            .awayTeamColor(v-bind:style="{ left: (100 - pickDetails.awayPercent) + '%', backgroundColor: pickDetails.awayColor }")
        .stats
          .columns.is-mobile
            .column
              img(v-bind:src="getLogoUrl(pickDetails.homeTeamLogoURL)")
              span.overwatch-font.home-percent {{ pickDetails.homePercent }}%
            .column
              img.is-pulled-right(v-bind:src="getLogoUrl(pickDetails.awayTeamLogoURL)")
              span.is-pulled-right.away-percent.overwatch-font {{ pickDetails.awayPercent }}%
    .wrap(v-else)
      h2 No Pick Rates Available
</template>

<script>
  import fireStats from '@/services/stats'

  export default {
    name: 'pick-rates',
    props: [
      'matchId'
    ],
    data () {
      return {
        pickDetails: {
          awayName: '',
          homeColor: '',
          awayPercent: '',
          awayColor: '',
          homeTeamLogoUrl: '',
          awayTeamLogoUrl: ''
        }
      }
    },
    computed: {
      currentStage: function () {
        return this.$store.getters.currentStage
      }
    },
    methods: {
      getLogoUrl: function (name) {
        return '/static/img/team-logos/' + name
      },
      getPickPercents: function () {
        var _this = this
        // check to see if we have it in the store already
        if (_this.matchId) {
          var statInfo = _this.$store.getters.getMatchById(_this.matchId)
          if (!statInfo) {
            // we need to get it and put it in store for other matches
            fireStats.getMatchPickPercents(_this.currentStage).then(function (picks) {
              _this.$store.dispatch('saveStats', picks)
              statInfo = picks.find(matchup => matchup.matchId === _this.matchId)
              _this.pickDetails = statInfo
            })
          }
          if (statInfo) _this.pickDetails = statInfo
        }
      }
    },
    mounted: function () {
      this.getPickPercents()
    }
  }
</script>

<style lang="scss" scoped>
  .away-percent {
    margin-top: 2px;
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