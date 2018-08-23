<template lang="pug">
  .stats
    section.section
      .container
        .box
          h2.text-border Pick Rates
          .select.is-pulled-right
            select(v-model="activeWeek")
              option(value="Week 1") Week 1
              option(value="Week 2") Week 2
              option(value="Week 3") Week 3
              option(value="Week 4") Week 4
              option(value="Week 5") Week 5
          .select.is-pulled-right
            select(v-on:change="getPicks(selectedStage)" v-model="selectedStage")
              option(value="") Change Stage
              option(value="Stage 1") Stage 1
              option(value="Stage 2") Stage 2
              option(value="Stage 3") Stage 3
              option(value="Stage 4") Stage 4
          .is-clearfix
          .spacer
          .pick-wrap(v-for="match in matches" v-if="match.week == activeWeek" v-bind:class="{'is-mobile': isMobile, 'is-old': isOld(match)}")
            .match-box
              .match-date
                span.overwatch-font {{ match.startDate | formatDate }}
              .titles
                .columns.is-mobile(v-if="match.homePercent || match.awayPercent")
                  .column
                    span.overwatch-font {{ match.homeShortName }}
                  .column
                    span.overwatch-font.is-pulled-right {{ match.awayShortName }}
              .chart
                .homeTeamColor(v-bind:style="{ backgroundColor: match.homeColor }")
                  .awayTeamColor(v-bind:style="{ left: (100 - match.awayPercent) + '%', backgroundColor: match.awayColor }")
              .stats
                .columns.is-mobile(v-if="match.homePercent || match.awayPercent")
                  .column
                    img(v-bind:src="match.homeTeamLogo" v-if="!match.homeTeamLogoUrl")
                    span.overwatch-font {{ match.homePercent }}%
                  .column
                    img.is-pulled-right(v-bind:src="match.awayTeamLogo" v-if="!match.awayTeamLogoUrl")
                    span.is-pulled-right.overwatch-font {{ match.awayPercent }}%
                .columns(v-else)
                  .column
                    p We don't have enough data yet.
              .count(v-show="showDetails")
                .columns.is-mobile
                  .column.is-half
                    p {{ match.homeShortName }} Wins 4-0: {{ match.homeSweepPercent }} %
                    p {{ match.homeShortName }} Wins 3-1: {{ match.homeThreeOnePercent }} %
                    //- p {{ match.homeShortName }} Wins 3-2: {{ match.homeTieBreakerPercent }} %
                  .column.is-half
                    p {{ match.awayShortName }} Wins 4-0: {{ match.awaySweepPercent }} %
                    p {{ match.awayShortName }} Wins 3-1: {{ match.awayThreeOnePercent }} %
                    //- p {{ match.awayShortName }} Wins 3-2: {{ match.awayTieBreakerPercent }} %
                    p.is-pulled-right {{ match.totalCount }} picks
          hr
          .columns
            .column.is-narrow
              label.checkbox
                input(type="checkbox" v-model="greyOld")
                |  Grey old matches
            .column.is-narrow
              label.checkbox
                input(type="checkbox" v-model="showDetails")
                |  show details
</template>

<script>
  import fireStats from '@/services/stats'
  import fireImage from '@/services/image'

  export default {
    name: 'stats',
    data () {
      return {
        matches: [],
        leagueData: {
          competitionId: 'gleuqAnpFrtKZo2zpjmu'
        },
        activeWeek: '',
        selectedStage: '',
        greyOld: false,
        showDetails: true
      }
    },
    computed: {
      stage: function () {
        return this.$store.getters.currentStage
      },
      week: function () {
        return this.$store.getters.currentWeek
      },
      isMobile: function () {
        return window.screen.width < 768
      },
      currentStage: function () {
        return this.$store.getters.currentStage
      },
      currentWeek: function () {
        return this.$store.getters.currentWeek
      }
    },
    methods: {
      getPicks: function (stage) {
        var _this = this
        if (stage) {
          fireStats.getMatchPickPercents(stage).then(function (matches) {
            matches.forEach(function (match) {
              match.homeTeamLogo = fireImage.getLocalTeamLogo(match.homeTeamLogoURL)
              match.awayTeamLogo = fireImage.getLocalTeamLogo(match.awayTeamLogoURL)
            })
            _this.matches = matches
          })
        }
      },
      isOld: function (match) {
        let today = Date.now() / 1000
        if (match.startDate < today && this.greyOld) return true
        else return false
      }
    },
    watch: {
      currentStage: function (val) {
        if (val) this.getPicks(this.$store.getters.currentStage)
      }
    },
    mounted: function () {
      this.getPicks(this.$store.getters.currentStage)
      this.activeWeek = this.week
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
  .is-old {
    filter: grayscale(1);
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