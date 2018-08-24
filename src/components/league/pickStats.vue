<template lang="pug">
  .pick-stats
    h2.text-border Your Pick Details
    .wrap(v-for="pick in computedPicks")
      statListing(:pick="pick", :leagueData="leagueData")
</template>

<script>
import statListing from '@/components/league/pickStatListing'

export default {
  name: 'pick-stats',
  props: [
    'oldMatchups', 'matchups', 'leaguePicks', 'leagueData'
  ],
  components: {
    statListing
  },
  data () {
    return {
      allPicks: [

      ]
    }
  },
  computed: {
    computedPicks: function () {
      // grab old matchups, grab picks - build out object to iterate through
      var _this = this
      var tmp = []
      if (_this.leaguePicks) {
        _this.oldMatchups.forEach(function (matchup) {
          var pick = {}
          _this.leaguePicks.forEach(function (lpick) {
            if (lpick.matchId === matchup.id) {
              pick.oldMatchup = matchup
              pick.myPick = lpick
              tmp.push(pick)
            }
          })
        })
        _this.matchups.forEach(function (matchup) {
          var pick = {}
          _this.leaguePicks.forEach(function (lpick) {
            if (lpick.matchId === matchup.id) {
              pick.oldMatchup = matchup
              pick.myPick = lpick
              tmp.push(pick)
            }
          })
        })
      }
      return tmp
    }
  },
  methods: {
    toggleVisible: function (pick) {
      console.log('toggling...')
      if (pick.visible) pick.visible = false
      else pick.visible = true
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
