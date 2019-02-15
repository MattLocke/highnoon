<template lang="pug">
  .my-trades
    .columns
      .column
        p Trades will be receiving many updates over the next day or two.  We'll also be releasing an article explaining how they work and why.  Please let me know if you have any issues!
        p After you accept or cancel a trade, the screen will refresh.  This is normal!  I will update it to not require that in the coming days.  :)
      .column.is-narrow
        b-field
          button.button.is-primary.is-small(@click="createTradeMode = !createTradeMode") {{ createTradeMode ? 'Cancel' : 'Create New Trade' }}
    .initiate-trade(v-if="createTradeMode")
      b-field(label="Choose League Member")
        b-select(placeholder="Select a Member" v-model="selectedUser")
          option(v-for="member in leagueUsers" :value="member" v-if="member.userId !== userId") {{ member.displayName }}
      b-field(label="Which Player?" v-if="selectedUser.userId")
        b-select(placeholder="Player" v-model="theirPlayer")
          option(v-for="player in theirPlayers" :value="player") {{ playersObject[player].name }}
      b-field(label="Your Players")
        b-select(placeholder="Select a Category" v-model="yourPlayer")
          option(v-for="player in myAvailableTrades" :value="player") {{ playersObject[player].name }}
      b-field
        button.button.is-primary(v-if="canCreate" @click="createTrade") Request Trade
        button.button.is-primary(v-else disabled) Request Trade
      hr
    .wrap(v-if="myTrades.length")
      trade-listing(v-for="trade in myTrades" :key="trade.requestDate" :trade="trade")
    .left-bar-item(v-else) You Have No Pending Trades
</template>

<script>
import { differenceWith, isEmpty } from 'lodash'
import firebase from 'firebase/app'
import 'firebase/database'

import TradeService from '@/services/trades'

import TradeListing from '@/views/manage/TradeListing'

export default {
  name: 'MyTrades',
  components: {
    TradeListing
  },
  props: {
    myPlayers: {
      type: [Array, Object],
      default: () => []
    },
    otherPlayers: {
      type: [Array, Object],
      default: () => []
    }
  },
  data () {
    return {
      createTradeMode: false,
      selectedUser: {},
      pendingTrades: [],
      theirPlayer: {},
      trades: [],
      yourPlayer: {}
    }
  },
  computed: {
    canCreate () {
      return (this.userId && this.yourPlayer && this.leagueId && this.selectedUser.userId && this.theirPlayer)
    },
    draftPicks () {
      return this.$store.getters.getDraftPicks
    },
    draftPicksUsers () {
      return Object.keys(this.draftPicks)
    },
    leagueId () {
      return this.$route.params.leagueId
    },
    leagueUsers () {
      return this.$store.getters.getLeagueUsers
    },
    lockedPlayers () {
      return this.$store.getters.getLockedPlayers
    },
    myTrades () {
      if (this.trades) {
        return this.trades.filter(trade => trade.askerId === this.userId || trade.responderId === this.userId)
      }
      return []
    },
    myAvailableTrades () {
      if (this.trades) {
        const ownTrades = this.trades.filter(trade => trade.askerId === this.userId || trade.responderId === this.userId)
        // make sure they're not trying to trade multiples of the same player
        const usedPlayers = [...this.lockedPlayers]
        ownTrades.forEach(trade => {
          usedPlayers.push(trade.askerPlayer)
          usedPlayers.push(trade.responderPlayer)
        })
        return differenceWith(this.myPlayers, usedPlayers, (a, b) => Number(a) === Number(b))
      }
      return []
    },
    playersLoaded () {
      return !isEmpty(this.playersObject)
    },
    playersObject () {
      return this.$store.getters.getPlayers
    },
    theirPlayers () {
      if (this.selectedUser.userId) return this.draftPicks[this.selectedUser.userId]
      return []
    },
    userId () {
      return this.$store.getters.getUserId
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
          firebase.database().ref(`trades/${val}`).on('value', (snapshot) => {
            const tmp = snapshot.val() ? Object.values(snapshot.val()) : []
            this.trades = tmp.filter(trade => trade.status !== 'complete')
          })
        }
      }
    },
    trades: {
      handler (val, oldVal) {
        if (oldVal) {
          // we had a trade complete, so for now we refresh to prevent corruption
          if (val.length < oldVal.length) window.location.reload()
        }
      }
    }
  },
  methods: {
    createTrade () {
      this.$store.dispatch('setLoading', true)
      const trade = {
        askerId: this.userId,
        askerName: this.userData.displayName,
        askerPlayer: this.yourPlayer,
        leagueId: this.leagueId,
        requestDate: Date.now(),
        responderId: this.selectedUser.userId,
        responderName: this.selectedUser.displayName,
        responderPlayer: this.theirPlayer,
        status: 'pending',
        votesFor: 0,
        votesAgains: 0
      }

      TradeService.createTrade(trade)
        .then(() => {
          this.$store.dispatch('setLoading', false)
        })
        .catch(() => {
          this.$store.dispatch('setLoading', false)
        })
        .finally(() => {
          this.resetForm()
        })
    },
    resetForm () {
      this.createTradeMode = false
      this.selectedUser = {}
      this.pendingTrades = []
      this.theirPlayer = {}
      this.yourPlayer = {}
    }
  }
}
</script>
