<template lang="pug">
  .roster-listing(v-if="playersLoaded")
    h3.orange {{ left.teamName }}
    roster-position(:score="playerScores[playerRoster.captain]" :name="getName(players[playerRoster.captain])" :isRight="isRight" role="captain")
    roster-position(:score="playerScores[playerRoster.offense1]" :name="getName(players[playerRoster.offense1])" :isRight="isRight" role="offense")
    roster-position(:score="playerScores[playerRoster.offense2]" :name="getName(players[playerRoster.offense2])" :isRight="isRight" role="offense")
    roster-position(:score="playerScores[playerRoster.support1]" :name="getName(players[playerRoster.support1])" :isRight="isRight" role="support")
    roster-position(:score="playerScores[playerRoster.support2]" :name="getName(players[playerRoster.support2])" :isRight="isRight" role="support")
    roster-position(:score="playerScores[playerRoster.tank1]" :name="getName(players[playerRoster.tank1])" :isRight="isRight" role="tank")
    roster-position(:score="playerScores[playerRoster.tank2]" :name="getName(players[playerRoster.tank2])" :isRight="isRight" role="tank")
    h3.orange(:class="{'is-pulled-right': !isRight}")  {{ playerTotal | playerScore }}
</template>

<script>
import { isEmpty } from 'lodash'
import LeagueService from '@/services/league'

import RosterPosition from '@/views/leagues/RosterPosition'

export default {
  name: 'RosterListing',
  components: {
    RosterPosition
  },
  props: {
    isRight: {
      type: Boolean,
      default: false
    },
    left: {
      type: Object,
      required: true
    },
    right: {
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
    fullRoster () {
      return this.$store.getters.getLeagueRoster
    },
    leagueId () {
      return this.$route.params.leagueId
    },
    leftLoaded () {
      return !isEmpty(this.left)
    },
    opponentRoster () {
      return !isEmpty(this.right) ? this.fullRoster[this.right.userId].roster : this.emptyRoster
    },
    opponentTotal () {
      return this.opponentRoster ? LeagueService.calculateRosterPoints(this.playerScores, this.opponentRoster) : 0
    },
    playerRoster () {
      return this.fullRoster[this.left.userId] ? this.fullRoster[this.left.userId].roster : this.emptyRoster
    },
    players () {
      return this.$store.getters.getPlayers
    },
    playersLoaded () {
      return !isEmpty(this.players)
    },
    playerTotal () {
      return LeagueService.calculateRosterPoints(this.playerScores, this.playerRoster)
    },
    playerScores () {
      return this.$store.getters.getPlayerScores || {}
    },
    rightLoaded () {
      return !isEmpty(this.right)
    }
  },
  watch: {
    leagueId: {
      immediate: true,
      handler (val) {
        if (val) {
          this.league = LeagueService.getLeague(val)
        }
      }
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
    .roster-position {
      background-color: #222;
      padding: .25rem;
      margin-bottom: .25rem;
      .player-score {
        font-size: 1.2rem;
      }
    }
  }
</style>
