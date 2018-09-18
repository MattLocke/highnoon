<template lang="pug">
  .picks
    .columns
      .column.is-one-quarter
        .wrap
          .box
            h1 This weeks matches
          .matchup-listing(v-for="match in weeksMatches" :key="match.id" @click="setActive(match)")
            .columns.is-mobile
              .column.team(:style="getBackground(match.competitors[0])")
                .columns.is-mobile.is-gapless
                  .column.is-narrow
                    img.team-logo(:src="getImage(match.competitors[0].abbreviatedName)")
                  .column
                    span.location {{ shortLocation(match.competitors[0].homeLocation) }}
                    span.team-name {{ teamName(match.competitors[0].name) }}
              .column.team.has-text-right(:style="getBackground(match.competitors[1])")
                .columns.is-mobile.is-gapless
                  .column
                    span.location {{ shortLocation(match.competitors[1].homeLocation) }}
                    span.team-name {{ teamName(match.competitors[1].name) }}
                  .column.is-narrow
                    img.team-logo(:src="getImage(match.competitors[1].abbreviatedName)")
      .column
        .wrap
          .box(v-if="activeMatch")
            h1 {{ homeTeamName }} vs {{ awayTeamName }}
</template>

<script>
import matchService from '@/services/matches'

export default {
  name: 'picks',
  data () {
    return {
      activeMatch: null,
      weeksMatches: []
    }
  },
  mounted () {
    matchService.getAllMatches()
      .then(matches => {
        this.weeksMatches = matches
      })
  },
  computed: {
    homeTeamName () {
      if (this.activeMatch) return this.activeMatch.competitors[0].name
      return null
    },
    awayTeamName () {
      if (this.activeMatch) return this.activeMatch.competitors[1].name
      return null
    }
  },
  methods: {
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
.team {
  padding: .4rem .4rem 0 .4rem;
}
.team-logo {
  height: 2.1rem;
  width: auto;
  filter: drop-shadow(1px 1px 0 #fff);
  margin: 0 .5rem;
}
.team-name {
  font-size: 1.4rem;
  font-family: 'overFont';
}
.has-text-right {
  text-align: right;
}
.matchup-listing {
  margin-bottom: 1rem;
  &:hover {
    border-right: 2px solid #fff;
  }
}
</style>
