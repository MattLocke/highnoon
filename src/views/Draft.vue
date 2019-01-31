<template lang="pug">
  .draft
    .columns.is-marginless
      left-bar(:showClose="false")
        section(v-if="isInLeague")
          h2.has-pointer(@click="showRoster = !showRoster") Your Roster - {{ roster.length }} of 12
            arrow(:isLeft="true" v-model="showRoster")
          .roster-section(v-show="showRoster")
            .columns.is-multiline.is-mobile
              .column.is-one-third-desktop.is-half-mobile(v-for="player in roster")
                player-card(:player="player" :showRemove="false" :primaryColor="getColor(player)" :score="player.stats.fantasyScore || 0")
              .column.is-one-third-desktop.is-half-mobile(v-for="placeholder in placeholders")
                player-card(:showRemove="false")
        section(v-if="isInLeague")
          collapsible(title-text="Remaining Requirements" :start-collapsed="true")
            .columns.is-mobile(v-show="showRequirements")
              .column.has-text-centered
                .big-number
                  img(src="images/roles/offense-white.svg" alt="offense")
                  | {{ remaining.offense }}
              .column.has-text-centered
                .big-number
                  img(src="images/roles/support-white.svg" alt="support")
                  | {{ remaining.support }}
              .column.has-text-centered
                .big-number
                  img(src="images/roles/tank-white.svg" alt="tank")
                  | {{ remaining.tank }}
        section
          collapsible(title-text="Draft Order" :start-collapsed="true")
            .left-bar-item(v-for="(user, index) in users" :class="{'active-item': index === draft.activeDrafter}")
              .columns.is-mobile
                .column.is-narrow
                  span {{ index + 1 }}
                .column
                  span {{ user.displayName }}
      .column
        //- Choose your player
        section(v-if="isCompleted && isInLeague")
          p The draft has been completed.
          hr
          router-link.button.is-primary(:to="`/manageTeam/${leagueId}`") Manage Your Team
        .columns.is-desktop(v-show="myTurn && !autoMode")
          .column.is-two-thirds-desktop(v-if="roster.length < 12")
            section
              h2 {{ draft.leagueName }} Live Draft
            section
              collapsible(title-text="Drafted Players" :start-collapsed="true")
                drafting-users(:users="users" :draft="draft" :picks="picks")
            section(v-if="!isCompleted")
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
            section(v-if="!isCompleted")
              b-table(
                :data="filteredPlayers"
                :loading="!(filteredPlayers.length)"
                ref="table"
                :paginated="filteredPlayers.length > 20"
                :per-page="20"
                :show-detail-icon="true")
                template(slot-scope="props")
                  b-table-column(width="60")
                    button.button.is-primary.is-small(@click="addToRoster(props.row)") Select
                  b-table-column(label="Role" width="30" field="attributes.role" sortable)
                    img(:src="`images/roles/${props.row.attributes.role || 'flex'}-white.svg`" width="22" height="22")
                  b-table-column(label="Team" width="30" field="team" sortable)
                    img(:src="`images/teams/${props.row.team}.svg`" width="22" height="22")
                  b-table-column(label="Player Name" field="name" sortable)
                    span {{ props.row.name }}
                  b-table-column(label="Rating" width="40" field="stats.fantasyScore" sortable)
                    span {{ props.row.stats.fantasyScore || 'N/A' }}
          .column(v-else)
            section
              p Congrats!  Your team is complete!
          .column.is-one-third-desktop
            trash-talk
        .columns.is-desktop(v-show="!myTurn || autoMode")
          //- See how the draft is going
          .column
            section(v-if="users.length")
              h2 {{ draft.leagueName }} Live Draft
              hr
              h3(v-if="!isCompleted") Currently Drafting:
                span.orange  {{ users[draft.activeDrafter].displayName }}
            section
              drafting-users(:users="users" :draft="draft" :picks="picks")
          .column.is-one-third-desktop
            trash-talk
      draft-drawer(:roster="roster")
</template>

<script>
import { differenceWith } from 'lodash'
import firebase from 'firebase/app'
import 'firebase/database'

import DraftDrawer from '@/views/draft/DraftDrawer'
import DraftingUsers from '@/views/draft/DraftingUsers'
import PlayerCard from '@/components/PlayerCard'
import PlayerLine from '@/views/draft/PlayerLine'
import TrashTalk from '@/views/draft/TrashTalk'

export default {
  name: 'Draft',
  components: {
    DraftDrawer,
    DraftingUsers,
    PlayerCard,
    PlayerLine,
    TrashTalk
  },
  data () {
    return {
      autoMode: false,
      draft: {
        activeDrafter: null
      },
      filterText: '',
      filterTeam: '',
      filterRole: '',
      picks: [],
      preferenceList: [],
      requiredOffense: 2,
      requiredSupport: 2,
      requiredTank: 2,
      showDraftOrder: true,
      showMenu: true,
      showRequirements: true,
      showRoster: true,
      users: []
    }
  },
  computed: {
    filteredPlayers () {
      let fPlayers = [...this.players]

      if (this.filterText) fPlayers = fPlayers.filter(player => player.name.toLowerCase().includes(this.filterText.toLowerCase()))
      if (this.filterRole) fPlayers = fPlayers.filter(player => player.attributes.role === this.filterRole)
      if (this.filterTeam) fPlayers = fPlayers.filter(player => player.team === this.filterTeam)
      fPlayers = differenceWith(fPlayers, this.selectedPlayers, (a, b) => a.id === b.id)
      return fPlayers
    },
    isCompleted () {
      return this.draft.status === 'completed'
    },
    isInLeague () {
      return this.userLeagues.some(league => league.leagueId === this.leagueId)
    },
    leagueId () {
      return this.$route.params.leagueId
    },
    myTurn () {
      if (this.users.length) return this.users[this.draft.activeDrafter].userId === this.userId
      return false
    },
    offensePlayers () {
      return this.roster.filter(player => player.attributes.role === 'offense')
    },
    placeholders () {
      let remaining = 12 - this.roster.length
      let tmp = []
      for (let i = 0; i < remaining; i++) {
        tmp.push(['placeholder'])
      }
      return tmp
    },
    players () {
      return this.$store.getters.getPlayers
    },
    remaining () {
      const remaining = {}
      remaining.offense = this.requiredOffense - this.offensePlayers.length > 0 ? this.requiredOffense - this.offensePlayers.length : 0
      remaining.tank = this.requiredTank - this.tankPlayers.length > 0 ? this.requiredTank - this.tankPlayers.length : 0
      remaining.support = this.requiredSupport - this.supportPlayers.length > 0 ? this.requiredSupport - this.supportPlayers.length : 0
      return remaining
    },
    roster () {
      return this.picks[this.userId] || []
    },
    selectedPlayers () {
      let selected = []
      Object.keys(this.picks).forEach((key) => {
        selected = [...selected, ...this.picks[key]]
      })
      return selected
    },
    stats () {
      return this.$store.getters.getStats
    },
    supportPlayers () {
      return this.roster.filter(player => player.attributes.role === 'support')
    },
    tankPlayers () {
      return this.roster.filter(player => player.attributes.role === 'tank')
    },
    teams () {
      return this.$store.getters.getTeams
    },
    totalRemaining () {
      return this.remaining.offense + this.remaining.support + this.remaining.tank
    },
    userId () {
      return this.$store.getters.getUserId
    },
    userLeagues () {
      return this.$store.getters.getUserLeagues
    }
  },
  watch: {
    draft: {
      handler (val) {
        // if they shouldn't be here, send them home!
        if (!val || val.status === 'unDrafted') this.$router.push({ path: `/LeagueStandard/${this.leagueId}` })
      }
    },
    leagueId: {
      immediate: true,
      handler (val) {
        if (val) {
          this.$store.dispatch('fetchLeagueUsers', { leagueId: this.leagueId, leagueType: 'standard' })
        }
      }
    },
    players: {
      immediate: true,
      handler (val) {
        if (val && val.length === 0) {
          this.$store.dispatch('setLoading', true)
          this.$store.dispatch('getPlayers')
        } else this.$store.dispatch('setLoading', false)
      }
    },
    teams: {
      immediate: true,
      handler (val) {
        if (val && val.length === 0) this.$store.dispatch('getTeams')
      }
    },
    userId: {
      immediate: true,
      handler (val) {
        if (val) {
          this.getPicks()
          this.getDraft()
          this.getDraftOrder()
          this.getPreferenceList()
        }
      }
    }
  },
  methods: {
    addToRoster (player) {
      this.$store.dispatch('setLoading', true)
      const db = firebase.database()
      const tmp = [...this.roster]
      tmp.push(player)

      db.ref(`/draftPicks/${this.leagueId}/${this.userId}`)
        .set(tmp)
        .then(() => {
          return db.ref(`/draft/${this.leagueId}`)
            .update({ doneProcessing: false })
        })
        .then(() => {
          this.filterText = ''
          this.$store.dispatch('setLoading', false)
        })
    },
    canSelect (player) {
      // if they met all the requirements, they can pick whoever!
      if (!this.draft.doneProcessing) return false
      if (this.totalRemaining === 0) return true

      // if there is only enough for roles that need feeling, strict mode!
      const strictMode = !!(this.totalRemaining >= this.placeholders.length)

      switch (player.attributes.role) {
        case 'offense': {
          return strictMode ? !!(this.remaining.offense > 0) : true
        }
        case 'support': {
          return strictMode ? !!(this.remaining.support > 0) : true
        }
        case 'tank': {
          return strictMode ? !!(this.remaining.tank > 0) : true
        }
        default: return false
      }
    },
    getColor (player) {
      const team = this.teams.filter(team => team.abbreviatedName === player.team)[0]
      if (team) return team.primaryColor === '000000' ? team.secondaryColor : team.primaryColor
      return '222'
    },
    getDraft () {
      if (this.leagueId) {
        const db = firebase.database()
        db.ref(`/draft/${this.leagueId}`).on('value', (snapshot) => {
          this.draft = snapshot.val()
        })
      }
    },
    getDraftOrder () {
      if (this.leagueId) {
        const db = firebase.database()
        db.ref(`/draftOrder/${this.leagueId}`).on('value', (snapshot) => {
          this.users = snapshot.val()
        })
      }
    },
    getPicks () {
      const db = firebase.database()
      db.ref(`/draftPicks/${this.leagueId}`).on('value', (snapshot) => {
        this.picks = snapshot.val() || []
      })
    },
    getPreferenceList () {
      const db = firebase.database()
      db.ref(`/draftPreference/${this.leagueId}/${this.userId}`).on('value', (snapshot) => {
        const tmp = snapshot.val()
        if (tmp) {
          this.preferenceList = tmp.players || []
          this.autoMode = tmp.autoMode
        }
      })
    },
    getScore (player) {
      const match = this.stats.filter(stat => stat.playerId === player.id)
      return match[0] ? match[0].fantasyScore : 0
    },
    getUserName (id) {
      return this.users.find(user => user.userId === id).displayName
    }
  }
}
</script>

<style lang="scss">
.draft {
  margin-bottom: 100px;
}
.drafting-users {
  h3.underlined {
    border-bottom: 1px solid rgba(255,255,255,0.2);
    margin-bottom: .5rem;
  }
}
.draft-user {
  background-color: rgba(255,255,255,0.1);
  margin: .25rem;
  &.active-item {
    background-color: #f99e1a;
  }
}
.draft-drawer {
  position: fixed;
  bottom: 0;
  background-color: rgba(0,0,0,0.8);
  width: 100%;
  .role-image {
    height: 18px;
    width: auto;
    margin-bottom: -3px;
  }
}
</style>
