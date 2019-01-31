<template lang="pug">
  .manage-fantasy-team
    .columns.is-marginless
      left-bar
        section
          router-link.button.is-primary(:to="`/LeagueUnlimited/${leagueId}`") Back To League
        section
          p More information to help you build your team coming soon!
      .column
        section
          h1 Manage Your Fantasy Team
        .columns.is-multiline.is-hidden-mobile.is-gapless(v-if="myAvailablePicks.length")
          .column
            section
              player-card(:player="lineUp.captain.id ? lineUp.captain : null" :showRemove="false" :score="lineUp.captain.stats ? lineUp.captain.stats.fantasyScore : 0")
              h2.has-text-centered Captain
          .column
            section
              player-card(:player="lineUp.offense1.id ? lineUp.offense1 : null" :showRemove="false" :score="lineUp.offense1.stats ? lineUp.offense1.stats.fantasyScore : 0")
              h2.has-text-centered Offense 1
          .column
            section
              player-card(:player="lineUp.offense2.id ? lineUp.offense2 : null" :showRemove="false" :score="lineUp.offense2.stats ? lineUp.offense2.stats.fantasyScore : 0")
              h2.has-text-centered Offense 2
          .column
            section
              player-card(:player="lineUp.support1.id ? lineUp.support1 : null" :showRemove="false" :score="lineUp.support1.stats ? lineUp.support1.stats.fantasyScore : 0")
              h2.has-text-centered Support 1
          .column
            section
              player-card(:player="lineUp.support2.id ? lineUp.support2 : null" :showRemove="false" :score="lineUp.support2.stats ? lineUp.support2.stats.fantasyScore : 0")
              h2.has-text-centered Support 2
          .column
            section
              player-card(:player="lineUp.tank1.id ? lineUp.tank1 : null" :showRemove="false" :score="lineUp.tank1.stats ? lineUp.tank1.stats.fantasyScore : 0")
              h2.has-text-centered Tank 1
          .column
            section
              player-card(:player="lineUp.tank2.id ? lineUp.tank2 : null" :showRemove="false" :score="lineUp.tank2.stats ? lineUp.tank2.stats.fantasyScore : 0")
              h2.has-text-centered Tank 2
        section.is-hidden-mobile
          button.button.is-primary(@click="saveRoster" :disabled="!canSaveRoster") Save Roster And Return To League
        section.is-hidden-desktop
          h2.ow-font.mobile-roster
            img(src="images/roles/captain-white.svg" width="20" height="20")
            img(:src="`images/teams/${lineUp.captain.team}.svg`" width="20" height="20" v-if="lineUp.captain.team")
            | {{ lineUp.captain.name || 'Empty' }}
          h2.ow-font
            img(src="images/roles/offense-white.svg" width="20" height="20")
            img(:src="`images/teams/${lineUp.offense1.team}.svg`" width="20" height="20" v-if="lineUp.offense1.team")
            | {{ lineUp.offense1.name || 'Empty' }}
          h2.ow-font
            img(src="images/roles/offense-white.svg" width="20" height="20")
            img(:src="`images/teams/${lineUp.offense2.team}.svg`" width="20" height="20" v-if="lineUp.offense2.team")
            | {{ lineUp.offense2.name || 'Empty' }}
          h2.ow-font
            img(src="images/roles/support-white.svg" width="20" height="20")
            img(:src="`images/teams/${lineUp.support1.team}.svg`" width="20" height="20" v-if="lineUp.support1.team")
            | {{ lineUp.support1.name || 'Empty' }}
          h2.ow-font
            img(src="images/roles/support-white.svg" width="20" height="20")
            img(:src="`images/teams/${lineUp.support2.team}.svg`" width="20" height="20" v-if="lineUp.support2.team")
            | {{ lineUp.support2.name || 'Empty' }}
          h2.ow-font
            img(src="images/roles/tank-white.svg" width="20" height="20")
            img(:src="`images/teams/${lineUp.tank1.team}.svg`" width="20" height="20" v-if="lineUp.tank1.team")
            | {{ lineUp.tank1.name || 'Empty' }}
          h2.ow-font
            img(src="images/roles/tank-white.svg" width="20" height="20")
            img(:src="`images/teams/${lineUp.tank2.team}.svg`" width="20" height="20" v-if="lineUp.tank2.team")
            | {{ lineUp.tank2.name || 'Empty' }}
          section.has-text-centered
            button.button.is-primary(@click="saveRoster" :disabled="!canSaveRoster") Save Roster And Return To League
        section
          .columns
            .column.is-narrow
              b-field(label="Filter Team")
                b-select(placeholder="Filter By Team" v-model="filterTeam")
                  option(value="") All
                  option(v-for="team in teams" :value="team.abbreviatedName") {{ team.name }}
            .column.is-narrow
              b-field(label="Filter Role")
                b-select(placeholder="Filter By Role" v-model="filterRole")
                  option(value="") All
                  option(value="offense") Offense
                  option(value="support") Support
                  option(value="tank") Tank
          b-field(label="Filter Players")
            b-input(type="text" v-model="filterText")
        section
          collapsible(title-text="My Bench")
            b-table(
              :data="filteredPlayers"
              :paginated="true"
              :per-page="30"
              )
              template(slot-scope="props")
                b-table-column(label="Role" width="30" field="attributes.role" sortable)
                  img(:src="`images/roles/${props.row.attributes.role || 'flex'}-white.svg`" width="22" height="22")
                b-table-column(label="Team" width="30" field="team" sortable)
                  img(:src="`images/teams/${props.row.team}.svg`" width="22" height="22")
                //- b-table-column(label="Next" width="30")
                  img(src="images/teams/PHI.svg" width="22" height="22")
                b-table-column(label="Player Name" field="name" sortable)
                  span {{ props.row.name }}
                b-table-column(label="Assign")
                  role-buttons(:player="props.row" @setRole="setRole")
                b-table-column(label="Rating" width="40" field="stats.fantasyScore" sortable)
                  span {{ props.row.stats.fantasyScore || 'N/A' }}
</template>

<script>
import { differenceWith, isEqual, get, isEmpty } from 'lodash'

import LeagueService from '@/services/league'

import PlayerCard from '@/components/PlayerCard'
import RoleButtons from '@/views/manage/RoleButtons'

export default {
  name: 'ManageTeam',
  components: {
    PlayerCard,
    RoleButtons
  },
  data () {
    return {
      availablePicks: [],
      filterText: '',
      filterTeam: '',
      filterRole: '',
      lineUp: {
        captain: {},
        offense1: {},
        offense2: {},
        support1: {},
        support2: {},
        tank1: {},
        tank2: {}
      }
    }
  },
  computed: {
    canSaveRoster () {
      return (this.lineUp.captain.id && this.lineUp.offense1.id && this.lineUp.offense2.id && this.lineUp.support1.id && this.lineUp.support2.id && this.lineUp.tank1.id && this.lineUp.tank2.id)
    },
    filteredPlayers () {
      let fPlayers = [...this.myAvailablePicks]

      if (this.filterText) fPlayers = fPlayers.filter(player => player.name.toLowerCase().includes(this.filterText.toLowerCase()))
      if (this.filterRole) fPlayers = fPlayers.filter(player => player.attributes.role === this.filterRole)
      if (this.filterTeam) fPlayers = fPlayers.filter(player => player.team === this.filterTeam)

      return fPlayers
    },
    leagueId () {
      return this.$route.params.leagueId
    },
    leagueRoster () {
      return this.$store.getters.getLeagueRoster
    },
    leagueSchedule () {
      return this.$store.getters.getLeagueSchedule
    },
    leagueUsers () {
      return this.$store.getters.getLeagueUsers
    },
    myAvailablePicks () {
      let available = []
      const usedPicks = [
        this.lineUp.captain,
        this.lineUp.offense1,
        this.lineUp.offense2,
        this.lineUp.support1,
        this.lineUp.support2,
        this.lineUp.tank1,
        this.lineUp.tank2
      ]
      available = differenceWith(this.players, usedPicks, isEqual)
      return [ ...available ]
    },
    players () {
      return this.$store.getters.getPlayers
    },
    teams () {
      return this.$store.getters.getTeams
    },
    userData () {
      return this.$store.getters.getUserData
    }
  },
  watch: {
    leagueRoster: {
      immediate: true,
      handler (val) {
        if (!isEmpty(val) && !isEmpty(this.userData)) {
          const tmp = get(val, this.userData.id, { roster: this.lineUp })
          this.lineUp = tmp.roster
        }
      }
    },
    userData: {
      handler (val) {
        if (!isEmpty(val) && !isEmpty(this.leagueRoster)) {
          const tmp = get(this.leagueRoster, val.id, { roster: this.lineUp })
          this.lineUp = tmp.roster
        }
      }
    }
  },
  methods: {
    saveRoster () {
      // save it to the db
      this.$store.dispatch('setLoading', true)
      LeagueService.saveRoster(this.userData.id, this.leagueId, this.lineUp, 'unlimited')
        .then(() => {
          // forward to league view page
          this.$router.push({ path: `/LeagueUnlimited/${this.leagueId}` })
        })
      return true
    },
    setRole (eventData) {
      this.lineUp[eventData.role] = eventData.player
    }
  },
  mounted () {
    this.$store.dispatch('fetchLeagueUsers', { leagueId: this.leagueId, leagueType: 'unlimited' })
    this.$store.dispatch('fetchRoster', { leagueId: this.leagueId, leagueType: 'unlimited' })
    this.$store.dispatch('getPlayers')
    this.$store.dispatch('getTeams')
  }
}
</script>

<style lang="scss">
  .placeholder {
    max-width: 120px;
    max-height: 200px;
    background-color: rgba(0,0,0,0.3);
    border-radius: 8px;
    margin: 0 auto;
  }
  .mobile-roster {
    img {
      margin: 0 4px;
    }
  }
</style>
