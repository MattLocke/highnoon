<template lang="pug">
  .manage-fantasy-team
    .columns.is-marginless
      left-bar
        section(v-if="liveConfig.canTrade")
          collapsible(title-text="Manage Trades" :start-collapsed="true")
            my-trades(:myPlayers="myPicks" :otherPlayers="otherPicks")
        section(v-else)
          span {{ liveConfig.featureDownMessage }}
        section
          collapsible(title-text="Unclaimed Players" :start-collapsed="true")
            .left-bar-item Coming Soon
        section
          scoring-info
        section
          collapsible(title-text="Your Next Match")
            my-schedule(:leagueId="leagueId")
      .column(v-if="lineUp.captain")
        section
          h1 Manage Your Fantasy Team
          p The captain role is (for now) just a flex role so you can have a player outside of the 2/2/2 we're enforcing.  Their points will count the same as any other role, so it's safe to feature your favorite DPS as your captain!
        .columns.is-multiline.is-hidden-mobile.is-gapless(v-if="myAvailablePicks.length")
          .column
            section.roster-view
              player-card(:player="lineUp.captain.id ? lineUp.captain : null" :showRemove="false" :score="lineUp.captain.stats ? lineUp.captain.stats.fantasyScore : 0")
              h2.has-text-centered Captain
          .column
            section.roster-view
              player-card(:player="lineUp.offense1.id ? lineUp.offense1 : null" :showRemove="false" :score="lineUp.offense1.stats ? lineUp.offense1.stats.fantasyScore : 0")
              h2.has-text-centered Offense 1
          .column
            section.roster-view
              player-card(:player="lineUp.offense2.id ? lineUp.offense2 : null" :showRemove="false" :score="lineUp.offense2.stats ? lineUp.offense2.stats.fantasyScore : 0")
              h2.has-text-centered Offense 2
          .column
            section.roster-view
              player-card(:player="lineUp.support1.id ? lineUp.support1 : null" :showRemove="false" :score="lineUp.support1.stats ? lineUp.support1.stats.fantasyScore : 0")
              h2.has-text-centered Support 1
          .column
            section.roster-view
              player-card(:player="lineUp.support2.id ? lineUp.support2 : null" :showRemove="false" :score="lineUp.support2.stats ? lineUp.support2.stats.fantasyScore : 0")
              h2.has-text-centered Support 2
          .column
            section.roster-view
              player-card(:player="lineUp.tank1.id ? lineUp.tank1 : null" :showRemove="false" :score="lineUp.tank1.stats ? lineUp.tank1.stats.fantasyScore : 0")
              h2.has-text-centered Tank 1
          .column
            section.roster-view
              player-card(:player="lineUp.tank2.id ? lineUp.tank2 : null" :showRemove="false" :score="lineUp.tank2.stats ? lineUp.tank2.stats.fantasyScore : 0")
              h2.has-text-centered Tank 2
        section.is-hidden-mobile
          button.button.is-primary(@click="saveRoster" v-if="canSaveRoster") Save Roster And Return To League
          button.button.is-primary(v-else disabled) Save Roster And Return To League
        section.is-hidden-desktop
          p The captain role is (for now) just a flex role so you can have a player outside of the 2/2/2 we're enforcing.  Their points will count the same as any other role, so it's safe to feature your favorite DPS as your captain!
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
                //- b-table-column(label="Next" width="30")
                  img(src="images/teams/PHI.svg" width="22" height="22")
                b-table-column(label="Player Name" field="name" sortable)
                  span {{ props.row.name }}
                b-table-column(label="Assign")
                  role-buttons(:player="props.row" @setRole="setRole")
                b-table-column(label="Rating" width="40" field="stats.fantasyScore" sortable)
                  span {{ props.row.stats.fantasyScore || 'N/A' }}
        section
          collapsible(title-text="League Rosters" :start-collapsed="true")
            drafting-users(:users="leagueUsers" :draft="draft" :picks="draftPicks")
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

export default {
  name: 'ManageTeam',
  components: {
    DraftingUsers,
    MySchedule,
    MyTrades,
    PlayerCard,
    RoleButtons,
    ScoringInfo
  },
  data () {
    return {
      availablePicks: [],
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
      if (isEmpty(this.lineUp)) return false
      return (this.lineUp.captain.id && this.lineUp.offense1.id && this.lineUp.offense2.id && this.lineUp.support1.id && this.lineUp.support2.id && this.lineUp.tank1.id && this.lineUp.tank2.id)
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
      available = differenceWith(this.myPicks, usedPicks, isEqual)
      return [ ...available ]
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
    }
  },
  watch: {
    leagueId: {
      immediate: true,
      handler (val) {
        if (val) {
          this.$store.dispatch('fetchDraft', val)
          this.$store.dispatch('fetchDraftPicks', val)
          this.$store.dispatch('fetchLeagueSchedule', val)
          this.$store.dispatch('fetchLeagueUsers', { leagueId: val, leagueType: 'standard' })
          this.$store.dispatch('fetchRoster', { leagueId: val, leagueType: 'standard' })
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
      this.lineUp[eventData.role] = eventData.player
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
