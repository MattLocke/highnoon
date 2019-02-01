<template lang="pug">
  .league-roster
    .columns.is-multiline.is-hidden-mobile.is-gapless(v-if="hasRoster")
      .column
        section
          player-card(:player="roster.captain.id ? roster.captain : null" :showRemove="false" :score="roster.captain.stats ? roster.captain.stats.fantasyScore : 0")
          h2.has-text-centered Captain
      .column
        section
          player-card(:player="roster.offense1.id ? roster.offense1 : null" :showRemove="false" :score="roster.offense1.stats ? roster.offense1.stats.fantasyScore : 0")
          h2.has-text-centered Offense 1
      .column
        section
          player-card(:player="roster.offense2.id ? roster.offense2 : null" :showRemove="false" :score="roster.offense2.stats ? roster.offense2.stats.fantasyScore : 0")
          h2.has-text-centered Offense 2
      .column
        section
          player-card(:player="roster.support1.id ? roster.support1 : null" :showRemove="false" :score="roster.support1.stats ? roster.support1.stats.fantasyScore : 0")
          h2.has-text-centered Support 1
      .column
        section
          player-card(:player="roster.support2.id ? roster.support2 : null" :showRemove="false" :score="roster.support2.stats ? roster.support2.stats.fantasyScore : 0")
          h2.has-text-centered Support 2
      .column
        section
          player-card(:player="roster.tank1.id ? roster.tank1 : null" :showRemove="false" :score="roster.tank1.stats ? roster.tank1.stats.fantasyScore : 0")
          h2.has-text-centered Tank 1
      .column
        section
          player-card(:player="roster.tank2.id ? roster.tank2 : null" :showRemove="false" :score="roster.tank2.stats ? roster.tank2.stats.fantasyScore : 0")
          h2.has-text-centered Tank 2
    section.is-hidden-desktop(v-if="hasRoster")
      h2.ow-font.mobile-roster
        img(src="images/roles/captain-white.svg" width="20" height="20")
        img(:src="`images/teams/${roster.captain.team}.svg`" width="20" height="20" v-if="roster.captain.team")
        | {{ roster.captain.name || 'Empty' }}
      h2.ow-font
        img(src="images/roles/offense-white.svg" width="20" height="20")
        img(:src="`images/teams/${roster.offense1.team}.svg`" width="20" height="20" v-if="roster.offense1.team")
        | {{ roster.offense1.name || 'Empty' }}
      h2.ow-font
        img(src="images/roles/offense-white.svg" width="20" height="20")
        img(:src="`images/teams/${roster.offense2.team}.svg`" width="20" height="20" v-if="roster.offense2.team")
        | {{ roster.offense2.name || 'Empty' }}
      h2.ow-font
        img(src="images/roles/support-white.svg" width="20" height="20")
        img(:src="`images/teams/${roster.support1.team}.svg`" width="20" height="20" v-if="roster.support1.team")
        | {{ roster.support1.name || 'Empty' }}
      h2.ow-font
        img(src="images/roles/support-white.svg" width="20" height="20")
        img(:src="`images/teams/${roster.support2.team}.svg`" width="20" height="20" v-if="roster.support2.team")
        | {{ roster.support2.name || 'Empty' }}
      h2.ow-font
        img(src="images/roles/tank-white.svg" width="20" height="20")
        img(:src="`images/teams/${roster.tank1.team}.svg`" width="20" height="20" v-if="roster.tank1.team")
        | {{ roster.tank1.name || 'Empty' }}
      h2.ow-font
        img(src="images/roles/tank-white.svg" width="20" height="20")
        img(:src="`images/teams/${roster.tank2.team}.svg`" width="20" height="20" v-if="roster.tank2.team")
        | {{ roster.tank2.name || 'Empty' }}
    section(v-else)
      p Your roster is empty!
    section
      router-link.button.is-primary.is-small(:to="`/manageTeam/${league.id}`" v-if="league.type === 'standard'") Manage Team
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
  }
}
</script>
