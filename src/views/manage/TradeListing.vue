<template lang="pug">
  .left-bar-item.trade-listing
    .columns.is-mobile
      .column
        h2
          img(:src="`images/roles/${trade.askerPlayer.attributes.role || 'flex'}-white.svg`" width="22" height="22")
          | {{ trade.askerPlayer.name }}
      .column.is-narrow
        h2
          span.orange for
      .column
        h2.is-pulled-right
          img(:src="`images/roles/${trade.responderPlayer.attributes.role || 'flex'}-white.svg`" width="22" height="22")
          | {{ trade.responderPlayer.name }}
    span.request-date.is-pulled-right {{ trade.requestDate | formatJSDate }}
    .columns
      .column.is-narrow(v-if="trade.responderId === userId && trade.status === 'pending'")
        button.button.is-primary.is-small(@click="acceptTrade") Accept Trade
      .column.is-narrow(v-else-if="trade.askerId === userId && trade.status === 'pending'")
        button.button.is-primary.is-small(@click="cancelTrade") Cancel Trade Offer
      .column.is-narrow(v-else)
        button.button.is-primary.is-small {{ trade.status }}
</template>

<script>
import TradeService from '@/services/trades'

export default {
  name: 'TradeListing',
  props: {
    trade: {
      type: Object,
      required: true
    }
  },
  computed: {
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
  }
</style>
