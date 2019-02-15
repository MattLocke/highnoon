<template lang="pug">
  .manage-fantasy-team
    .columns.is-marginless
      left-bar
        section
          collapsible(title-text="Unclaimed Players" :start-collapsed="true")
            .left-bar-item Coming Soon
        section
          scoring-info(:league="league")
        section
          collapsible(title-text="Your Next Match")
            my-schedule(:leagueId="leagueId")
      .column(v-if="playersLoaded")
        section
          h1 Manage Your Fantasy Team
          p The captain role is (for now) just a flex role so you can have a player outside of the 2/2/2 we're enforcing.  Their points will count the same as any other role, so it's safe to feature your favorite DPS as your captain!
        b-tabs(v-model="activeContentTab")
          b-tab-item(label="ManageRoster")
            .columns.is-multiline.is-hidden-mobile.is-gapless(v-if="myAvailablePicks.length")
              .column.is-full
                section
                  editable-field(:initial-value="teamName" @updated-value="setTeamName")
              .column
                section.roster-view.has-text-centered
                  player-card(:player="lineUp.captain ? players[lineUp.captain] : null" :showRemove="false")
                  h2.has-text-centered Captain
                    button.button.is-secondary.is-small.is-remove(@click="lineUp.captain = ''" v-if="lineUp.captain && notLocked(lineUp.captain)" v-tooltip="'Remove'") X
              .column.roster-view
                section
                  player-card(:player="lineUp.offense1 ? players[lineUp.offense1] : null" :showRemove="false")
                  h2.has-text-centered Offense 1
                    button.button.is-secondary.is-small.is-remove(@click="lineUp.offense1 = ''" v-if="lineUp.offense1 && notLocked(lineUp.offense1)" v-tooltip="'Remove'") X
              .column.roster-view
                section
                  player-card(:player="lineUp.offense2 ? players[lineUp.offense2] : null" :showRemove="false")
                  h2.has-text-centered Offense 2
                    button.button.is-secondary.is-small.is-remove(@click="lineUp.offense2 = ''" v-if="lineUp.offense2 && notLocked(lineUp.offense2)" v-tooltip="'Remove'") X
              .column.roster-view
                section
                  player-card(:player="lineUp.support1 ? players[lineUp.support1] : null" :showRemove="false")
                  h2.has-text-centered Support 1
                    button.button.is-secondary.is-small.is-remove(@click="lineUp.support1 = ''" v-if="lineUp.support1 && notLocked(lineUp.support1)" v-tooltip="'Remove'") X
              .column.roster-view
                section
                  player-card(:player="lineUp.support2 ? players[lineUp.support2] : null" :showRemove="false")
                  h2.has-text-centered Support 2
                    button.button.is-secondary.is-small.is-remove(@click="lineUp.support2 = ''" v-if="lineUp.support2 && notLocked(lineUp.support2)" v-tooltip="'Remove'") X
              .column.roster-view
                section
                  player-card(:player="lineUp.tank1 ? players[lineUp.tank1] : null" :showRemove="false")
                  h2.has-text-centered Tank 1
                    button.button.is-secondary.is-small.is-remove(@click="lineUp.tank1 = ''" v-if="lineUp.tank1 && notLocked(lineUp.tank1)" v-tooltip="'Remove'") X
              .column.roster-view
                section
                  player-card(:player="lineUp.tank2 ? players[lineUp.tank2] : null" :showRemove="false")
                  h2.has-text-centered Tank 2
                    button.button.is-secondary.is-small.is-remove(@click="lineUp.tank2 = ''" v-if="lineUp.tank2 && notLocked(lineUp.tank2)" v-tooltip="'Remove'") X
            section.is-hidden-mobile
              button.button.is-primary(@click="saveRoster" v-if="canSaveRoster") Save Roster And Return To League
              button.button.is-primary(disabled v-else) Save Roster And Return To League
            section.is-hidden-desktop
              p The captain role is (for now) just a flex role so you can have a player outside of the 2/2/2 we're enforcing.  Their points will count the same as any other role, so it's safe to feature your favorite DPS as your captain!
              h2.ow-font.mobile-roster
                img(src="images/roles/captain-white.svg" width="20" height="20")
                img(v-if="lineUp.captain" :src="getTeamImage(lineUp.captain)" width="20" height="20")
                span {{ getPlayerName(lineUp.captain) }}
                  button.button.is-secondary.is-small.is-remove(@click="lineUp.captain = ''" v-if="lineUp.captain && notLocked(lineUp.captain)") X
              h2.ow-font
                img(src="images/roles/offense-white.svg" width="20" height="20")
                img(:src="getTeamImage(lineUp.offense1)" width="20" height="20" v-if="lineUp.offense1")
                span {{ getPlayerName(lineUp.offense1) }}
                  button.button.is-secondary.is-small.is-remove(@click="lineUp.offense1 = ''" v-if="lineUp.offense1 && notLocked(lineUp.offense1)") X
              h2.ow-font
                img(src="images/roles/offense-white.svg" width="20" height="20")
                img(:src="getTeamImage(lineUp.offense2)" width="20" height="20" v-if="lineUp.offense2")
                span {{ getPlayerName(lineUp.offense2) }}
                  button.button.is-secondary.is-small.is-remove(@click="lineUp.offense2 = ''" v-if="lineUp.offense2 && notLocked(lineUp.offense2)") X
              h2.ow-font
                img(src="images/roles/support-white.svg" width="20" height="20")
                img(:src="getTeamImage(lineUp.support1)" width="20" height="20" v-if="lineUp.support1")
                span {{ getPlayerName(lineUp.support1) }}
                  button.button.is-secondary.is-small.is-remove(@click="lineUp.support1 = ''" v-if="lineUp.support1 && notLocked(lineUp.support1)") X
              h2.ow-font
                img(src="images/roles/support-white.svg" width="20" height="20")
                img(:src="getTeamImage(lineUp.support2)" width="20" height="20" v-if="lineUp.support2")
                span {{ getPlayerName(lineUp.support2) }}
                  button.button.is-secondary.is-small.is-remove(@click="lineUp.support2 = ''" v-if="lineUp.support2 && notLocked(lineUp.support2)") X
              h2.ow-font
                img(src="images/roles/tank-white.svg" width="20" height="20")
                img(:src="getTeamImage(lineUp.tank1)" width="20" height="20" v-if="lineUp.tank1")
                span {{ getPlayerName(lineUp.tank1) }}
                  button.button.is-secondary.is-small.is-remove(@click="lineUp.tank1 = ''" v-if="lineUp.tank1 && notLocked(lineUp.tank1)") X
              h2.ow-font
                img(src="images/roles/tank-white.svg" width="20" height="20")
                img(:src="getTeamImage(lineUp.tank2)" width="20" height="20" v-if="lineUp.tank2")
                span {{ getPlayerName(lineUp.tank2) }}
                  button.button.is-secondary.is-small.is-remove(@click="lineUp.tank2 = ''" v-if="lineUp.tank2 && notLocked(lineUp.tank2)") X
              section.has-text-centered
                button.button.is-primary(@click="saveRoster" v-if="canSaveRoster") Save Roster And Return To League
                button.button.is-primary(v-else disabled) Save Roster And Return To League
            section
              collapsible(title-text="My Bench")
                b-table(
                  :data="myAvailablePicks")
                  template(slot-scope="props")
                    b-table-column(label="Role" width="30" field="attributes.role" sortable)
                      img(:src="`images/roles/${props.row.attributes.role || 'flex'}-white.svg`" width="22" height="22")
                    b-table-column(label="Team" width="30" field="team" sortable)
                      img(:src="`images/teams/${props.row.team}.svg`" width="22" height="22")
                    b-table-column(label="Player Name" field="name" sortable)
                      span {{ props.row.name }}
                    b-table-column(label="Assign")
                      role-buttons(:player="props.row" @setRole="setRole" :lineUp="lineUp" :lockedRoles="lockedRoles" :isLocked="!notLocked(props.row.id)")
                    b-table-column(label="Rating" width="40" field="stats.fantasyScore" sortable)
                      span {{ props.row.stats.fantasyScore || 'N/A' }}
            section
              collapsible(title-text="League Rosters" :start-collapsed="true")
                drafting-users(:users="leagueUsers" :draft="draft" :picks="draftPicks" :ownerId="league.ownerId")
          b-tab-item(label="Trades")
            .wrap(v-if="liveConfig.canTrade")
              h2 Manage Trades
              my-trades(:myPlayers="myPicks" :otherPlayers="otherPicks")
            section(v-else)
              span {{ liveConfig.featureDownMessage }}
          b-tab-item(label="Waiver Wire")
            .wrap(v-if="liveConfig.canWaiverWire")
              waiver-wire(:players="players" :myPicks="myPicks" :otherPicks="otherPicks" :leagueRoster="leagueRoster")
            section(v-else)
              span This feature is currently being worked on.
</template>

<script>
import { differenceWith, isEmpty, isEqual, sortBy } from 'lodash'

import LeagueService from '@/services/league'

import DraftingUsers from '@/views/draft/DraftingUsers'
import MySchedule from '@/views/manage/MySchedule'
import MyTrades from '@/views/manage/MyTrades'
import PlayerCard from '@/components/PlayerCard'
import RoleButtons from '@/views/manage/RoleButtons'
import ScoringInfo from '@/views/leagues/ScoringInfo'
import WaiverWire from '@/views/manage/MyWaiverWire'

export default {
  name: 'ManageTeam',
  components: {
    DraftingUsers,
    MySchedule,
    MyTrades,
    PlayerCard,
    RoleButtons,
    ScoringInfo,
    WaiverWire
  },
  data () {
    return {
      activeContentTab: null,
      availablePicks: [],
      league: {},
      lineUp: {
        captain: null,
        offense1: null,
        offense2: null,
        support1: null,
        support2: null,
        tank1: null,
        tank2: null
      }
    }
  },
  computed: {
    canSaveRoster () {
      return !!(this.lineUp.captain && this.lineUp.offense1 && this.lineUp.offense2 && this.lineUp.support1 && this.lineUp.support2 && this.lineUp.tank1 && this.lineUp.tank2)
    },
    draft () {
      return this.$store.getters.getDraft
    },
    draftPicks () {
      return this.$store.getters.getDraftPicks
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
    liveConfig () {
      return this.$store.getters.getLiveConfig
    },
    lockedPlayers () {
      return this.$store.getters.getLockedPlayers
    },
    lockedRoles () {
      const locked = []
      if (this.lockedPlayers.includes(this.lineUp.captain)) locked.push('captain')
      if (this.lockedPlayers.includes(this.lineUp.offense1)) locked.push('offense1')
      if (this.lockedPlayers.includes(this.lineUp.offense2)) locked.push('offense2')
      if (this.lockedPlayers.includes(this.lineUp.support1)) locked.push('support1')
      if (this.lockedPlayers.includes(this.lineUp.support2)) locked.push('support2')
      if (this.lockedPlayers.includes(this.lineUp.tank1)) locked.push('tank1')
      if (this.lockedPlayers.includes(this.lineUp.tank2)) locked.push('tank2')

      return locked
    },
    myLeagueSchedule () {
      return []
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
      available = differenceWith(this.myPicks, usedPicks, (a, b) => a === b)
      const tmp = []
      available.forEach(a => {
        tmp.push(this.players[a])
      })
      return tmp
    },
    myPicks () {
      const thePicks = this.draftPicks ? this.draftPicks[this.userData.id] || [] : []
      return sortBy(thePicks, 'name')
    },
    myRoster () {
      if (this.userData.id && !isEmpty(this.leagueRoster)) return this.leagueRoster[this.userData.id] ? this.leagueRoster[this.userData.id].roster : {}
    },
    otherPicks () {
      const thePicks = this.draftPicks ? Object.values(this.draftPicks) : []
      const flat = [].concat.apply([], thePicks)
      const other = differenceWith(flat, this.myPicks, isEqual)
      return sortBy([ ...other ], 'name')
    },
    players () {
      return this.$store.getters.getPlayers
    },
    playersLoaded () {
      return !isEmpty(this.players)
    },
    myPlayersOffense () {
      return this.myAvailablePicks ? this.myAvailablePicks.filter(pick => pick.attributes.role === 'offense') : []
    },
    myPlayersSupport () {
      return this.myAvailablePicks ? this.myAvailablePicks.filter(pick => pick.attributes.role === 'support') : []
    },
    myPlayersTank () {
      return this.myAvailablePicks ? this.myAvailablePicks.filter(pick => pick.attributes.role === 'tank') : []
    },
    userData () {
      return this.$store.getters.getUserData
    },
    teamName () {
      return this.leagueUsers.find(user => user.userId === this.userData.id) ? this.leagueUsers.find(user => user.userId === this.userData.id).teamName : ''
    }
  },
  watch: {
    leagueId: {
      immediate: true,
      handler (val) {
        if (val) {
          LeagueService.getLeague(val).then((league) => {
            this.league = league
            this.$store.dispatch('fetchDraft', val)
            this.$store.dispatch('fetchDraftPicks', val)
            this.$store.dispatch('fetchLeagueSchedule', val)
            this.$store.dispatch('fetchLeagueUsers', { leagueId: val, leagueType: 'standard' })
            this.$store.dispatch('fetchRoster', { leagueId: val, leagueType: 'standard' })
          })
        }
      }
    },
    myRoster: {
      immediate: true,
      handler (val) {
        if (!isEmpty(val)) {
          this.lineUp = { ...val }
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
    notLocked (player) {
      return !(this.lockedPlayers.some(l => l === player))
    },
    saveRoster () {
      // save it to the db
      this.$store.dispatch('setLoading', true)
      LeagueService.saveRoster(this.userData.id, this.leagueId, this.lineUp)
        .then(() => {
          // forward to league view page
          this.$router.push({ path: `/LeagueStandard/${this.leagueId}` })
        })
      return true
    },
    setRole (eventData) {
      console.table(eventData)
      this.lineUp[eventData.role] = eventData.player.id
    },
    setTeamName (newTeamName) {
      const leagueUser = this.leagueUsers.find(user => user.userId === this.userData.id)
      const updatedLeagueUser = {
        [leagueUser.userId]: {
          ...leagueUser,
          teamName: newTeamName
        }
      }
      LeagueService.updateDraftTeamUser(updatedLeagueUser, this.leagueId, 'standard')
    }
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
