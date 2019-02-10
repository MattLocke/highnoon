<template lang="pug">
  .manage-fantasy-team
    .columns.is-marginless
      left-bar
        section
          router-link.button.is-primary(:to="`/LeagueUnlimited/${leagueId}`") Back To League
        section
          scoring-info
      .column(v-if="playersLoaded")
        section
          h1 Manage Your Fantasy Team
          h3 {{ this.leagueUsers.find(user => user.userId === userData.id).teamName }}
          p The captain role is (for now) just a flex role so you can have a player outside of the 2/2/2 we're enforcing.  Their points will count the same as any other role, so it's safe to feature your favorite DPS as your captain!
        .columns.is-multiline.is-hidden-mobile.is-gapless(v-if="myAvailablePicks.length")
          .column
            section.roster-view.has-text-centered
              player-card(:player="lineUp.captain ? players[lineUp.captain] : null" :showRemove="false")
              h2.has-text-centered Captain
                button.button.is-secondary.is-small.is-remove(@click="lineUp.captain = ''" v-if="lineUp.captain" v-tooltip="'Remove'") X
          .column.roster-view
            section
              player-card(:player="lineUp.offense1 ? players[lineUp.offense1] : null" :showRemove="false")
              h2.has-text-centered Offense 1
                button.button.is-secondary.is-small.is-remove(@click="lineUp.offense1 = ''" v-if="lineUp.offense1" v-tooltip="'Remove'") X
          .column.roster-view
            section
              player-card(:player="lineUp.offense2 ? players[lineUp.offense2] : null" :showRemove="false")
              h2.has-text-centered Offense 2
                button.button.is-secondary.is-small.is-remove(@click="lineUp.offense2 = ''" v-if="lineUp.offense2" v-tooltip="'Remove'") X
          .column.roster-view
            section
              player-card(:player="lineUp.support1 ? players[lineUp.support1] : null" :showRemove="false")
              h2.has-text-centered Support 1
                button.button.is-secondary.is-small.is-remove(@click="lineUp.support1 = ''" v-if="lineUp.support1" v-tooltip="'Remove'") X
          .column.roster-view
            section
              player-card(:player="lineUp.support2 ? players[lineUp.support2] : null" :showRemove="false")
              h2.has-text-centered Support 2
                button.button.is-secondary.is-small.is-remove(@click="lineUp.support2 = ''" v-if="lineUp.support2" v-tooltip="'Remove'") X
          .column.roster-view
            section
              player-card(:player="lineUp.tank1 ? players[lineUp.tank1] : null" :showRemove="false")
              h2.has-text-centered Tank 1
                button.button.is-secondary.is-small.is-remove(@click="lineUp.tank1 = ''" v-if="lineUp.tank1" v-tooltip="'Remove'") X
          .column.roster-view
            section
              player-card(:player="lineUp.tank2 ? players[lineUp.tank2] : null" :showRemove="false")
              h2.has-text-centered Tank 2
                button.button.is-secondary.is-small.is-remove(@click="lineUp.tank2 = ''" v-if="lineUp.tank2" v-tooltip="'Remove'") X
        section.is-hidden-mobile
          button.button.is-primary(@click="saveRoster" v-if="canSaveRoster") Save Roster And Return To League
          button.button.is-primary(disabled v-else) Save Roster And Return To League
        section.is-hidden-desktop
          p The captain role is (for now) just a flex role so you can have a player outside of the 2/2/2 we're enforcing.  Their points will count the same as any other role, so it's safe to feature your favorite DPS as your captain!
          h2.ow-font.mobile-roster
            img(src="images/roles/captain-white.svg" width="20" height="20")
            img(v-if="lineUp.captain" :src="getTeamImage(lineUp.captain)" width="20" height="20")
            span {{ getPlayerName(lineUp.captain) }}
              button.button.is-secondary.is-small.is-remove(@click="lineUp.captain = ''" v-if="lineUp.captain") X
          h2.ow-font
            img(src="images/roles/offense-white.svg" width="20" height="20")
            img(:src="getTeamImage(lineUp.offense1)" width="20" height="20" v-if="lineUp.offense1")
            span {{ getPlayerName(lineUp.offense1) }}
              button.button.is-secondary.is-small.is-remove(@click="lineUp.offense1 = ''" v-if="lineUp.offense1") X
          h2.ow-font
            img(src="images/roles/offense-white.svg" width="20" height="20")
            img(:src="getTeamImage(lineUp.offense2)" width="20" height="20" v-if="lineUp.offense2")
            span {{ getPlayerName(lineUp.offense2) }}
              button.button.is-secondary.is-small.is-remove(@click="lineUp.offense2 = ''" v-if="lineUp.offense2") X
          h2.ow-font
            img(src="images/roles/support-white.svg" width="20" height="20")
            img(:src="getTeamImage(lineUp.support1)" width="20" height="20" v-if="lineUp.support1")
            span {{ getPlayerName(lineUp.support1) }}
              button.button.is-secondary.is-small.is-remove(@click="lineUp.support1 = ''" v-if="lineUp.support1") X
          h2.ow-font
            img(src="images/roles/support-white.svg" width="20" height="20")
            img(:src="getTeamImage(lineUp.support2)" width="20" height="20" v-if="lineUp.support2")
            span {{ getPlayerName(lineUp.support2) }}
              button.button.is-secondary.is-small.is-remove(@click="lineUp.support2 = ''" v-if="lineUp.support2") X
          h2.ow-font
            img(src="images/roles/tank-white.svg" width="20" height="20")
            img(:src="getTeamImage(lineUp.tank1)" width="20" height="20" v-if="lineUp.tank1")
            span {{ getPlayerName(lineUp.tank1) }}
              button.button.is-secondary.is-small.is-remove(@click="lineUp.tank1 = ''" v-if="lineUp.tank1") X
          h2.ow-font
            img(src="images/roles/tank-white.svg" width="20" height="20")
            img(:src="getTeamImage(lineUp.tank2)" width="20" height="20" v-if="lineUp.tank2")
            span {{ getPlayerName(lineUp.tank2) }}
              button.button.is-secondary.is-small.is-remove(@click="lineUp.tank2 = ''" v-if="lineUp.tank2") X
          section.has-text-centered
            button.button.is-primary(@click="saveRoster" v-if="canSaveRoster") Save Roster And Return To League
            button.button.is-primary(v-else disabled) Save Roster And Return To League
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
                b-table-column(label="Player Name" field="name" sortable)
                  span {{ props.row.name }}
                b-table-column(label="Assign")
                  role-buttons(:lineUp="lineUp" :player="props.row" @setRole="setRole")
                b-table-column(label="Rating" width="40" field="stats.fantasyScore" sortable)
                  span {{ props.row.stats.fantasyScore || 'N/A' }}
</template>

<script>
import { differenceWith, get, isEmpty } from 'lodash'

import LeagueService from '@/services/league'

import PlayerCard from '@/components/PlayerCard'
import RoleButtons from '@/views/manage/RoleButtons'
import ScoringInfo from '@/views/leagues/ScoringInfo'

export default {
  name: 'ManageUnlimitedTeam',
  components: {
    PlayerCard,
    RoleButtons,
    ScoringInfo
  },
  data () {
    return {
      availablePicks: [],
      filterText: '',
      filterTeam: '',
      filterRole: '',
      lineUp: {
        captain: '',
        offense1: '',
        offense2: '',
        support1: '',
        support2: '',
        tank1: '',
        tank2: ''
      }
    }
  },
  computed: {
    canSaveRoster () {
      return !!(this.lineUp.captain && this.lineUp.offense1 && this.lineUp.offense2 && this.lineUp.support1 && this.lineUp.support2 && this.lineUp.tank1 && this.lineUp.tank2)
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
      available = differenceWith(Object.values(this.players), usedPicks, (a, b) => a.id === b)
      return [ ...available ]
    },
    players () {
      return this.$store.getters.getPlayers
    },
    playersLoaded () {
      return !isEmpty(this.players)
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
    getPlayerName (id) {
      return id && this.players[id] ? this.players[id].name : 'Empty'
    },
    getTeamImage (id) {
      return id && this.players[id] ? `images/teams/${this.players[id].team}.svg` : ''
    },
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
      if (this.lineUp !== undefined) this.lineUp[eventData.role] = eventData.player.id
    }
  },
  mounted () {
    this.$store.dispatch('fetchLeagueUsers', { leagueId: this.leagueId, leagueType: 'unlimited' })
    this.$store.dispatch('fetchRoster', { leagueId: this.leagueId, leagueType: 'unlimited' })
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
  .manage-fantasy-team {
    .is-remove {
      padding: 0 6px;
      height: 1.1rem;
      margin-top: .6rem;
      margin-left: .25rem;
    }
  }
</style>
