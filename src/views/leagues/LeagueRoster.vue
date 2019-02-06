<template lang="pug">
  .league-roster(v-if="playersLoaded")
    .columns.is-multiline.is-hidden-mobile.is-gapless(v-if="hasRoster")
      .column
        section
          player-card(:player="roster.captain ? players[roster.captain] : null" :showRemove="false")
          h2.has-text-centered Captain
      .column
        section
          player-card(:player="roster.offense1 ? players[roster.offense1] : null" :showRemove="false")
          h2.has-text-centered Offense 1
      .column
        section
          player-card(:player="roster.offense2 ? players[roster.offense2] : null" :showRemove="false")
          h2.has-text-centered Offense 2
      .column
        section
          player-card(:player="roster.support1 ? players[roster.support1] : null" :showRemove="false")
          h2.has-text-centered Support 1
      .column
        section
          player-card(:player="roster.support2 ? players[roster.support2] : null" :showRemove="false")
          h2.has-text-centered Support 2
      .column
        section
          player-card(:player="roster.tank1 ? players[roster.tank1] : null" :showRemove="false")
          h2.has-text-centered Tank 1
      .column
        section
          player-card(:player="roster.tank2 ? players[roster.tank2] : null" :showRemove="false")
          h2.has-text-centered Tank 2
    section.is-hidden-desktop(v-if="hasRoster")
      h2.ow-font.mobile-roster
        img(src="images/roles/captain-white.svg" width="20" height="20")
        img(:src="getTeamImage(roster.captain)" width="20" height="20" v-if="roster.captain")
        | {{ players[roster.captain].name || 'Empty' }}
      h2.ow-font
        img(src="images/roles/offense-white.svg" width="20" height="20")
        img(:src="getTeamImage(roster.offense1)" width="20" height="20" v-if="roster.offense1")
        | {{ players[roster.offense1].name || 'Empty' }}
      h2.ow-font
        img(src="images/roles/offense-white.svg" width="20" height="20")
        img(:src="getTeamImage(roster.offense2)" width="20" height="20" v-if="roster.offense2")
        | {{ players[roster.offense2].name || 'Empty' }}
      h2.ow-font
        img(src="images/roles/support-white.svg" width="20" height="20")
        img(:src="getTeamImage(roster.support1)" width="20" height="20" v-if="roster.support1")
        | {{ players[roster.support1].name || 'Empty' }}
      h2.ow-font
        img(src="images/roles/support-white.svg" width="20" height="20")
        img(:src="getTeamImage(roster.support2)" width="20" height="20" v-if="roster.support2")
        | {{ players[roster.support2].name || 'Empty' }}
      h2.ow-font
        img(src="images/roles/tank-white.svg" width="20" height="20")
        img(:src="getTeamImage(roster.tank1)" width="20" height="20" v-if="roster.tank1")
        | {{ players[roster.tank1].name || 'Empty' }}
      h2.ow-font
        img(src="images/roles/tank-white.svg" width="20" height="20")
        img(:src="getTeamImage(roster.tank2)" width="20" height="20" v-if="roster.tank2")
        | {{ players[roster.tank2].name || 'Empty' }}
    section(v-else)
      p Your roster is empty!
    section
      router-link.button.is-primary.is-small(:to="`/manageTeam/${league.id}`" v-if="league.leagueType === 'standard'") Manage Team
      router-link.button.is-primary.is-small(:to="`/manageUnlimitedTeam/${league.id}`" v-else) Manage Team
</template>

<script>
import { isEmpty, get } from 'lodash'

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
    hasRoster () {
      return !isEmpty(this.roster)
    },
    fullRoster () {
      return this.$store.getters.getLeagueRoster
    },
    players () {
      return this.$store.getters.getPlayers
    },
    playersLoaded () {
      return !isEmpty(this.players)
    },
    roster () {
      return get(this.fullRoster[this.userId], 'roster', {})
    },
    userId () {
      return this.$store.getters.getUserId
    }
  },
  watch: {
    userId: {
      immediate: true,
      handler (val) {
        if (val) {
          // snag the roster
          this.$store.dispatch('fetchRoster', { leagueId: this.league.id, leagueType: this.league.leagueType })
        }
      }
    }
  },
  methods: {
    getTeamImage (id) {
      if (this.playersLoaded && id && this.players[id]) {
        console.log(this.playersLoaded)
        return `images/teams/${this.players[id].team}.svg`
      }
      return ``
    }
  }
}
</script>
