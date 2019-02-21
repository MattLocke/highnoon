<template lang="pug">
  section.trade-listing
    .columns
      .column.is-narrow
        player-card(:player="playersObject[trade.askerPlayer]" :showRemove="false")
        span.is-mice Owner:
        span.owner-name {{ trade.askerName }}
      .column.is-narrow
        player-card(:player="playersObject[trade.responderPlayer]" :showRemove="false")
        span.is-mice Owner:
        span.owner-name {{ trade.responderName }}
      .column.is-narrow
        h3 {{ playersObject[trade.askerPlayer].name }}
          span.orange  for
          |  {{ playersObject[trade.responderPlayer].name }}
        .request-date.has-text-centered {{ trade.requestDate | formatJSDate }}
        hr
        .columns
          .column.has-text-centered(v-if="trade.responderId === userId && trade.status === 'pending' && !isLocked")
            button.button.is-primary.is-small(@click="acceptTrade") Accept Trade
          .column.has-text-centered(v-else-if="trade.askerId === userId && trade.status === 'pending'")
            button.button.is-primary.is-small(@click="cancelTrade") Cancel Trade Offer
          .column.has-text-centered(v-else)
            button.button.is-primary.is-small {{ trade.status }}
        section(v-if="isLocked")
          p One or more players are locked for this trade.  Please wait until Monday!
</template>

<script>
import { isEmpty } from 'lodash'
import TradeService from '@/services/trades'

import PlayerCard from '@/components/PlayerCard'

export default {
  name: 'TradeListing',
  components: {
    PlayerCard
  },
  props: {
    trade: {
      type: Object,
      required: true
    }
  },
  computed: {
    isLocked () {
      return this.lockedPlayers ? (this.lockedPlayers.find(p => p === String(this.trade.askerPlayer) || p === String(this.trade.responderPlayer))) : false
    },
    lockedPlayers () {
      return this.$store.getters.getLockedPlayers || []
    },
    playersLoaded () {
      return !isEmpty(this.playersObject)
    },
    playersObject () {
      return this.$store.getters.getPlayers
    },
    userId () {
      return this.$store.getters.getUserId
    }
  },
  methods: {
    cancelTrade () {
      TradeService.cancelTrade(this.trade)
    },
    acceptTrade () {
      this.$store.dispatch('setLoading', true)
      TradeService.acceptTrade(this.trade)
    }
  }
}
</script>

<style lang="scss">
  .trade-listing {
    .request-date {
      font-size: .65rem;
    }
    .owner-name {
      display: block;
      margin-top: -.5rem;
    }
  }
</style>
