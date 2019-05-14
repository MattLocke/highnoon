<template lang="pug">
  .league-roster(v-if="playersLoaded")
    .columns.is-multiline.is-hidden-mobile.is-gapless(v-if="hasRoster && players")
      .column
        section
          player-card(:player="roster.captain ? players[roster.captain] : null")
          h2.has-text-centered Captain
      .column
        section
          player-card(:player="roster.offense1 ? players[roster.offense1] : null")
          h2.has-text-centered Offense 1
      .column
        section
          player-card(:player="roster.offense2 ? players[roster.offense2] : null")
          h2.has-text-centered Offense 2
      .column
        section
          player-card(:player="roster.support1 ? players[roster.support1] : null")
          h2.has-text-centered Support 1
      .column
        section
          player-card(:player="roster.support2 ? players[roster.support2] : null")
          h2.has-text-centered Support 2
      .column
        section
          player-card(:player="roster.tank1 ? players[roster.tank1] : null")
          h2.has-text-centered Tank 1
      .column
        section
          player-card(:player="roster.tank2 ? players[roster.tank2] : null")
          h2.has-text-centered Tank 2
    section.is-hidden-desktop(v-if="hasRoster && players")
      h2.ow-font.mobile-roster
        img(src="images/roles/captain-white.svg" width="20" height="20")
        img(:src="getTeamImage(roster.captain)" width="20" height="20" v-if="roster.captain")
        | {{ players[roster.captain] ? players[roster.captain].name : 'Empty' }} -
        span.orange  {{ playerScores[roster.captain] | playerScore }}
      h2.ow-font
        img(src="images/roles/offense-white.svg" width="20" height="20")
        img(:src="getTeamImage(roster.offense1)" width="20" height="20" v-if="roster.offense1")
        | {{ players[roster.offense1] ? players[roster.offense1].name : 'Empty' }} -
        span.orange  {{ playerScores[roster.offense1] | playerScore }}
      h2.ow-font
        img(src="images/roles/offense-white.svg" width="20" height="20")
        img(:src="getTeamImage(roster.offense2)" width="20" height="20" v-if="roster.offense2")
        | {{ players[roster.offense2] ? players[roster.offense2].name : 'Empty' }} -
        span.orange  {{ playerScores[roster.offense2] | playerScore }}
      h2.ow-font
        img(src="images/roles/support-white.svg" width="20" height="20")
        img(:src="getTeamImage(roster.support1)" width="20" height="20" v-if="roster.support1")
        | {{ players[roster.support1] ? players[roster.support1].name : 'Empty' }} -
        span.orange  {{ playerScores[roster.support1] | playerScore }}
      h2.ow-font
        img(src="images/roles/support-white.svg" width="20" height="20")
        img(:src="getTeamImage(roster.support2)" width="20" height="20" v-if="roster.support2")
        | {{ players[roster.support2] ? players[roster.support2].name : 'Empty' }} -
        span.orange  {{ playerScores[roster.support2] | playerScore }}
      h2.ow-font
        img(src="images/roles/tank-white.svg" width="20" height="20")
        img(:src="getTeamImage(roster.tank1)" width="20" height="20" v-if="roster.tank1")
        | {{ players[roster.tank1] ? players[roster.tank1].name : 'Empty' }} -
        span.orange  {{ playerScores[roster.tank1] | playerScore }}
      h2.ow-font
        img(src="images/roles/tank-white.svg" width="20" height="20")
        img(:src="getTeamImage(roster.tank2)" width="20" height="20" v-if="roster.tank2")
        | {{ players[roster.tank2] ? players[roster.tank2].name : 'Empty' }} -
        span.orange  {{ playerScores[roster.tank2] | playerScore }}
    section(v-if="!hasRoster")
      p Your roster is empty!
    section
      .columns
        .column
          h3 Your Roster Total:
            span.orange  {{ rosterTotal | playerScore }}
        .column.is-narrow
          router-link.button.is-primary.is-small(:to="`/manageTeam/${league.id}`" v-if="league.leagueType === 'standard'") Manage Team
          router-link.button.is-primary.is-small(:to="`/manageUnlimitedTeam/${league.id}`" v-else) Manage Team
</template>

<script>
import { isEmpty, forEach, get } from 'lodash'

import PlayerCard from '@/components/PlayerCard'

export default {
  name: 'LeagueRoster',
  props: {
    league: {
      type: Object,
      required: true
    }
  },
  components: {
    PlayerCard
  },
  computed: {
    config () {
      return this.$store.getters.getConfig
    },
    hasRoster () {
      return !isEmpty(this.roster)
    },
    fullRoster () {
      return this.$store.getters.getLeagueRoster
    },
    players () {
      return this.$store.getters.getPlayers
    },
    playerScores () {
      return this.league.rawScoring ? this.$store.getters.getPlayerTotalScores : this.$store.getters.getPlayerScores
    },
    playersLoaded () {
      return !isEmpty(this.players)
    },
    roster () {
      const emptyRoster = {
        captain: '',
        offense1: '',
        offense2: '',
        support1: '',
        support2: '',
        tank1: '',
        tank2: ''
      }
      const userRoster = get(this.fullRoster[this.userId], 'roster', {})
      return { ...emptyRoster, ...userRoster }
    },
    rosterPoints () {
      return this.$store.getters.getLeagueRosterPoints || {}
    },
    rosterTotal () {
      const s = this.playerScores
      let total = 0

      forEach(this.roster, (playerId, position) => {
        total = total + (s[playerId] || 0)
      })
      return total
    },
    userId () {
      return this.$store.getters.getUserId
    },
    weeklyPoints () {
      const actualPoints = get(this.rosterPoints, `${this.config.currentWeek}.${this.userId}`, {})
      return {
        captain: '',
        captainScore: 0,
        offense1: '',
        offense1Score: 0,
        offense2: '',
        offense2Score: 0,
        support1: '',
        support1Score: 0,
        support2: '',
        support2Score: 0,
        tank1: '',
        tank1Score: 0,
        tank2: '',
        tank2Score: 0,
        ...actualPoints
      }
    }
  },
  watch: {
    userId: {
      immediate: true,
      handler (val) {
        if (val) {
          // snag the roster
          this.$store.dispatch('fetchRoster', { leagueId: this.league.id, leagueType: this.league.leagueType })
          this.$store.dispatch('fetchRosterPoints', { leagueId: this.league.id, leagueType: this.league.leagueType })
        }
      }
    }
  },
  methods: {
    getScore (playerId) {
      return Number(this.playerScores[playerId]) || 0
    },
    getTeamImage (id) {
      if (this.playersLoaded && id && this.players[id]) {
        // console.log(this.playersLoaded)
        return `images/teams/${this.players[id].teamShortName}.svg`
      }
      return ``
    }
  }
}
</script>
