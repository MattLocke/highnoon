<template lang="pug">
  .picks
    .columns
      left-bar
        .wrap
          .box
            h1 This weeks matches
            hr
            .matchup-listing(v-for="(match, index) in stageMatches" :key="match.id" @click="setActive(match)" v-if="index < 36")
              .columns.is-mobile
                .column.team(:style="getBackground(match.competitors[0])")
                  .columns.is-mobile.is-gapless
                    .column.is-narrow
                      img.team-logo(:src="getImage(match.competitors[0].abbreviatedName)")
                    .column
                      span.team-name {{ teamName(match.competitors[0].name) }}
                .column.team.has-text-right(:style="getBackground(match.competitors[1])")
                  .columns.is-mobile.is-gapless
                    .column
                      span.team-name {{ teamName(match.competitors[1].name) }}
                    .column.is-narrow
                      img.team-logo(:src="getImage(match.competitors[1].abbreviatedName)")
            hr

      .column
        .container
          .box(v-if="activeMatch")
            .columns
              .column
                h1 {{ homeTeam.name }}
              .column.is-narrow
                span.orange.is-inline  vs
              .column.has-text-right
                h1 {{ awayTeam.name }}
            .columns
              .column.is-half.is-team-stats
                team-profile(:team="homeTeam" :players="homeTeamPlayers")
              .column.is-half.is-team-stats
                team-profile(:team="awayTeam" :players="awayTeamPlayers")
</template>

<script>
import matchService from '@/services/matches'
import teamService from '@/services/teams'

import TeamProfile from '@/views/picks/TeamProfile'

export default {
  name: 'picks',
  components: {
    TeamProfile
  },
  data () {
    return {
      activeMatch: null,
      weeksMatches: [],
      teams: []
    }
  },
  mounted () {
    this.$store.dispatch('setLoading', true)
    matchService.getAllMatches()
      .then(matches => {
        this.weeksMatches = matches
        this.$store.dispatch('setLoading', false)
      })
    teamService.getAllTeams()
      .then(teams => {
        this.teams = teams.reduce((map, obj) => {
          map[obj.abbreviatedName] = obj
          return map
        }, {})
      })
  },
  computed: {
    homeTeam () {
      if (this.activeMatch) return this.teams[this.activeMatch.competitors[0].abbreviatedName]
      return null
    },
    awayTeam () {
      if (this.activeMatch) return this.teams[this.activeMatch.competitors[1].abbreviatedName]
      return null
    },
    homeTeamPlayers () {
      if (this.activeMatch && this.homeTeam) return this.teams[this.homeTeam.abbreviatedName].players
      return null
    },
    awayTeamPlayers () {
      if (this.activeMatch && this.awayTeam) return this.teams[this.awayTeam.abbreviatedName].players
      return null
    },
    stageMatches () {
      return this.weeksMatches.filter(match => match.stage === 'stage1').sort((a, b) => a.endDateTS - b.endDateTS)
    }
  },
  methods: {
    playerUrl (player) {
      return `/player/${player.name}`
    },
    setActive (match) {
      this.activeMatch = match
    },
    getImage (name) {
      return `images/teams/${name}.svg`
    },
    shortLocation (location) {
      if (location) {
        const tmp = location.split(',')
        return tmp[0]
      }
    },
    teamName (name) {
      if (name) {
        return name.split(' ').pop()
      }
    },
    getBackground (competitor) {
      let color = competitor.primaryColor

      if (competitor.primaryColor === '000000') {
        color = competitor.secondaryColor
      }
      return { 'background-color': `#${color}` }
    }
  }
}
</script>

<style lang="scss">
.location {
  font-size: .7rem;
  line-height: .5rem;
  font-family: 'overFont';
  display: block;
}
.is-inline {
  line-height: 3em;
}
.team {
  padding: .4rem .4rem 0 .4rem;
}
.team-logo {
  height: 2.1rem;
  width: auto;
  filter: drop-shadow(1px 1px 0 #fff);
  margin: 0 .2rem;
}
.team-name {
  font-size: 1.4rem;
  font-family: 'overFont';
  filter: drop-shadow(1px 1px 0 #000);
}
.has-text-right {
  text-align: right;
}
.matchup-listing {
  margin: 1rem;
  &:hover {
    border-right: 2px solid #fff;
    cursor: pointer;
  }
}
</style>
