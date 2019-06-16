<template lang="pug">
  .waiver-wire
    collapsible(title-text="The Waiver Wire")
      p This is where you can exchange players you have for players that are unclaimed in the draft.  To prevent unfair advantages in release dates vs. a user's schedule, there's a system called Waiver Wire.  What this does is creates a period of time where people can say which players they'd like to swap for.  Then at the end of the period, whoever has the worst record will get first dibs on player X, if more than one person wanted that player.  This helps keeps things interesting and is a long-proven good idea!  Good luck all!
      p.orange Player scores here are per 10/min.  They're meant to be more relative than absolute.  In the future this may change.  <3
    hr
    section(v-if="this.liveConfig.waiverWireDisabled")
      h2.orange Waiver Wire has passed for this week!
      p That means you can swap players from the pool, first come first serve.  Players lock as their match begins, so be weary of that!  The waiver wire will be active again at 12:00am PST Monday morning every week, and will unlock for free trade after assigning waiver wire picks on Tuesdays at 11:00am PST.  Thank you!
    b-field(label="Player I'd Like To Exchange")
      b-select(v-model="myPlayer")
        option(v-for="player in myPicksFiltered" :value="playersWithEmpty[player]") {{ playersWithEmpty[player].name }} ({{ playersWithEmpty[player].role | capFirst }})
    .columns
      .column.is-three-quarters
        section(v-show="!selectedPlayer.id")
          .columns
            .column.is-narrow
              b-field(label="Filter Team")
                b-select(placeholder="Filter By Team" v-model="filterTeam")
                  option(value="") All
                  option(v-for="team in teams" :value="team.shortName") {{ team.name }}
            .column.is-narrow
              b-field(label="Filter Role")
                b-select(placeholder="Filter By Role" v-model="filterRole")
                  option(value="") All
                  option(value="offense") Offense
                  option(value="support") Support
                  option(value="tank") Tank
            .column
              b-field(label="Filter Players")
                b-input(type="text" v-model="filterText")
        b-table(
          :data="superFilteredPlayers"
          ref="table"
          :paginated="filteredPlayers && filteredPlayers.length > 20"
          :per-page="20"
          :show-detail-icon="true"
          v-show="!selectedPlayer.id")
          template(slot-scope="props")
            b-table-column(width="60")
              button.button.is-primary.is-small(@click="selectPlayer(props.row)") Select
            b-table-column(label="Role" width="30" field="role" sortable)
              img(:src="`images/roles/${props.row.role || 'flex'}-white.svg`" width="22" height="22")
            b-table-column(label="Team" width="30" field="team" sortable)
              img(:src="`images/teams/${props.row.teamShortName}.svg`" width="22" height="22")
            b-table-column(label="Player Name" field="name" sortable)
              span.title-font {{ props.row.name }}
            b-table-column(label="Heroes")
              span.title-font {{ (props.row && props.row.heroes) ? props.row.heroes.join(' / ') : 'N/A' }}
            b-table-column(label="Rating" width="40" field="stats.fantasyScore" sortable)
              span.title-font {{ props.row.fantasyScore | playerScore }}
        .columns(v-if="selectedPlayer.id")
          .column.is-narrow
            h3 I would like
            player-card(:player="selectedPlayer")
          .column.is-narrow(v-if="myPlayer.id")
            h3 in exchange for
            player-card(:player="myPlayer")
        hr
        .columns
          .column.is-narrow
            b-field
              button.button.is-small.is-primary(@click="requestExchange" v-if="canRequest") Request This Exchange
              button.button.is-small.is-primary(disabled v-else v-tooltip="'Please selecte both players before exchanging.'") Request This Exchange
          .column.is-narrow
            b-field
              button.button.is-small.is-secondary(@click="selectedPlayer = {}") Select Different Player
      .column.is-one-quarter
        h3 Pending Waiver Wires
        .waiver-wire-item(v-for="(ww, index) in pendingWaiverWires" v-if="ww && isMyWaiverWire(ww)" :key="`${ww.gains}${ww.loses}`")
          .requester.columns
            .column
              span.mice {{ ww.requesterDisplayName }} wants
            .column.is-narrow
              eva-icon.has-pointer(name="close" fill="orange" width="12" height="12" v-tooltip="'Cancel Waiver Wire'" @click="cancelWaiver(index)")
          .columns
            .column
              span.ow-font.orange
                img(:src="`images/teams/${players[ww.gains].teamShortName}.svg`" width="14" height="14")
                img(:src="`images/roles/${players[ww.gains].role || 'flex'}-white.svg`" width="14" height="14")
                | {{ players[ww.gains].name }}
            .column.is-narrow
              span.ow-font for
            .column
              span.ow-font.orange.is-pulled-right
                | {{ players[ww.loses].name }}
                img(:src="`images/roles/${players[ww.loses].role || 'flex'}-white.svg`" width="14" height="14")
                img(:src="`images/teams/${players[ww.loses].teamShortName}.svg`" width="14" height="14")
</template>

<script>
import { differenceWith } from 'lodash'
import firebase from 'firebase/app'
import 'firebase/database'

import LeagueService from '@/services/league'

import PlayerCard from '@/components/PlayerCard'

export default {
  name: 'WaiverWire',
  components: {
    PlayerCard
  },
  props: {
    isOwner: {
      type: Boolean,
      default: false
    },
    players: {
      type: Object,
      default: () => ({})
    },
    myPicks: {
      type: Array,
      default: () => ([])
    },
    otherPicks: {
      type: Array,
      default: () => ([])
    },
    leagueRoster: {
      type: [Array, Object]
    }
  },
  data () {
    return {
      filterText: '',
      filterRole: '',
      filterTeam: '',
      myPlayer: {},
      pendingWaiverWires: [],
      selectedPlayer: {},
      trades: []
    }
  },
  computed: {
    canRequest () {
      return this.myPlayer && (this.selectedPlayer && this.selectedPlayer.id)
    },
    emptyPlayers () {
      const emptyPlayer = {
        name: 'Empty',
        attributes: {
          role: 'None'
        }
      }
      const emptyPlayers = []
      const max = this.myPicks ? 12 - this.myPicks.length : 0
      // console.log(`Max is: ${max}`)
      for (let i = 0; i < max; i++) {
        emptyPlayers.push({ id: i, ...emptyPlayer })
      }
      return emptyPlayers
    },
    filteredPlayers () {
      const tmpPlayers = this.players ? Object.values(this.players) : []
      const selectedPlayers = this.myPicks.concat(this.otherPicks)
      const availablePlayers = differenceWith(tmpPlayers, selectedPlayers, (a, b) => Number(a.id) === Number(b))
      const afterTrades = differenceWith(availablePlayers, this.trades, (a, b) => Number(a.id) === Number(b.askerPlayer) || Number(a.id) === Number(b.responderPlayer))
      return differenceWith(afterTrades, this.lockedPlayers, (a, b) => Number(a.id) === Number(b))
    },
    superFilteredPlayers () {
      let fPlayers = [...this.filteredPlayers]

      if (this.filterText) fPlayers = fPlayers.filter(player => player.name.toLowerCase().includes(this.filterText.toLowerCase()))
      if (this.filterRole) fPlayers = fPlayers.filter(player => player.role === this.filterRole)
      if (this.filterTeam) fPlayers = fPlayers.filter(player => player.teamShortName === this.filterTeam)
      fPlayers = differenceWith(fPlayers, Object.values(this.pendingWaiverWires), (a, b) => (Number(a.id) === Number(b.loses) && b.requesterId === this.userData.id) || (Number(a.id) === Number(b.gains) && b.requesterId === this.userData.id))

      return fPlayers
    },
    leagueId () {
      return this.$route.params.leagueId
    },
    liveConfig () {
      return this.$store.getters.getLiveConfig
    },
    lockedPlayers () {
      return this.$store.getters.getLockedPlayers
    },
    myPicksFiltered () {
      const tmpPicks = differenceWith(this.myPicks, this.trades, (a, b) => Number(a) === Number(b.askerPlayer) || Number(a) === Number(b.responderPlayer))
      const afterWires = differenceWith(tmpPicks, Object.values(this.pendingWaiverWires), (a, b) => (Number(a) === Number(b.loses) && b.requesterId === this.userData.id) || (Number(a) === Number(b.gains) && b.requesterId === this.userData.id))
      const afterLock = differenceWith(afterWires, this.lockedPlayers, (a, b) => Number(a) === Number(b))
      const filteredPlayers = []
      for (let i = 0; i < this.emptyPlayers.length; i++) {
        filteredPlayers.push(i)
      }
      return [ ...afterLock, ...filteredPlayers ]
    },
    playersWithEmpty () {
      const tmpMap = {}
      this.emptyPlayers.map(p => {
        tmpMap[p.id] = p
      })
      return { ...this.players, ...tmpMap }
    },
    teams () {
      return this.$store.getters.getTeams
    },
    userData () {
      return this.$store.getters.getUserData || {}
    }
  },
  watch: {
    leagueId: {
      immediate: true,
      handler (val) {
        firebase.database().ref(`trades/${val}`).on('value', (snapshot) => {
          const tmp = snapshot.val() ? Object.values(snapshot.val()) : []
          this.trades = tmp.filter(trade => trade.status !== 'complete')
        })
        this.getWaivers()
      }
    }
  },
  methods: {
    cancelWaiver (waiverId) {
      LeagueService.cancelWaiver(this.leagueId, waiverId)
        .then(() => {
          this.getWaivers()
          this.$toast.open({
            message: 'Successfully canceled!',
            type: 'is-info',
            position: 'is-bottom'
          })
        })
    },
    getWaivers () {
      this.pendingWaiverWires = {}
      LeagueService.getPendingWaiverWires(this.leagueId)
        .then(wires => {
          this.pendingWaiverWires = wires || {}
        })
    },
    isMyWaiverWire (ww) {
      return ww.requesterId === this.userData.id
    },
    requestExchange () {
      // console.log('Requesting Exchange...')
      this.$store.dispatch('setLoading', true)
      const waiver = {
        leagueId: this.leagueId,
        requesterId: this.userData.id,
        requesterDisplayName: this.userData.displayName,
        loses: this.myPlayer.id,
        gains: this.selectedPlayer.id,
        requested: Date.now(),
        status: 'pending'
      }

      const instant = this.liveConfig.waiverWireDisabled

      LeagueService.requestWaiver(waiver, instant)
        .then(() => {
          this.myPlayer = {}
          this.selectedPlayer = {}
          this.getWaivers()
          this.$toast.open({
            message: 'Successfully requested!',
            type: 'is-success',
            position: 'is-bottom'
          })
          window.location.reload()
        })
        .catch(() => {
          this.$toast.open({
            message: 'Error requesting waiver.',
            type: 'is-danger',
            position: 'is-bottom'
          })
        })
        .finally(() => {
          this.$store.dispatch('setLoading', false)
        })
    },
    selectPlayer (player) {
      this.selectedPlayer = player
    }
  }
}
</script>

<style lang="scss">
.waiver-wire-item {
  background-color: rgba(0,0,0,0.3);
  padding: .25rem;
  margin-bottom: .25rem;
  .requester {
    margin-bottom: -24px;
  }
}
.my-waiver {
  &:hover {
    cursor: pointer;
    background-color: rgba(255,255,255,0.1);
  }
}
</style>
