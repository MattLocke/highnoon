<template lang="pug">
  .roster-listing(v-if="playersLoaded && playerRoster")
    h3.orange
      span(:class="{'is-pulled-right': isRight}") {{ team.teamName }}
    roster-position(:score="playerScores[playerRoster.captain]" :name="getName(players[playerRoster.captain])" :isRight="isRight" role="captain")
    roster-position(:score="playerScores[playerRoster.offense1]" :name="getName(players[playerRoster.offense1])" :isRight="isRight" role="offense")
    roster-position(:score="playerScores[playerRoster.offense2]" :name="getName(players[playerRoster.offense2])" :isRight="isRight" role="offense")
    roster-position(:score="playerScores[playerRoster.support1]" :name="getName(players[playerRoster.support1])" :isRight="isRight" role="support")
    roster-position(:score="playerScores[playerRoster.support2]" :name="getName(players[playerRoster.support2])" :isRight="isRight" role="support")
    roster-position(:score="playerScores[playerRoster.tank1]" :name="getName(players[playerRoster.tank1])" :isRight="isRight" role="tank")
    roster-position(:score="playerScores[playerRoster.tank2]" :name="getName(players[playerRoster.tank2])" :isRight="isRight" role="tank")
    h3(:class="{'is-pulled-right': !isRight}")
      span(:class="{'orange': !raw, 'faded': raw}") {{ playerRoster.bestScore | playerScore }}
      span(v-if="playerRoster.bestScore > 0")  /
      span(v-if="playerRoster.totalScore > 0" :class="{'orange': raw, 'faded': !raw}")  {{ playerRoster.totalScore | playerScore }}
</template>

<script>
import { isEmpty } from 'lodash'

import RosterPosition from '@/views/leagues/RosterPosition'

export default {
  name: 'RosterListing',
  components: {
    RosterPosition
  },
  props: {
    fullRoster: {
      type: Object,
      required: true
    },
    isRight: {
      type: Boolean,
      default: false
    },
    team: {
      type: Object,
      required: true
    },
    raw: {
      type: Boolean,
      default: false
    },
    playerScores: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      emptyRoster: {
        captain: null,
        offense1: null,
        offense2: null,
        support1: null,
        support2: null,
        tank1: null,
        tank2: null
      },
      league: {}
    }
  },
  computed: {
    leagueId () {
      return this.$route.params.leagueId
    },
    playerBest () {
      return this.fullRoster && this.fullRoster[this.team.userId] ? this.fullRoster[this.team.userId].bestScore : 0
    },
    playerRoster () {
      if (this.team.captain) return this.team
      return this.fullRoster[this.team.userId] ? this.fullRoster[this.team.userId] : this.emptyRoster
    },
    players () {
      return this.$store.getters.getPlayers
    },
    playersLoaded () {
      return !isEmpty(this.players)
    }
  },
  methods: {
    getName (nameObj) {
      return nameObj ? nameObj.name : 'Vacant'
    }
  }
}
</script>

<style lang="scss">
  .roster-listing {
    h3 {
      max-height: 33px;
      overflow: hidden;
    }
    .roster-position {
      background-color: #222;
      padding: .25rem;
      margin-bottom: .25rem;
      .player-score {
        font-size: 1.2rem;
      }
    }
    .faded {
      opacity: 0.5;
    }
  }
</style>
