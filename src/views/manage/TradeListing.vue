<template lang="pug">
  .left-bar-item.trade-listing
    span.request-date.is-pulled-right {{ trade.requestDate | formatJSDate }}
    h3 Trade
    .columns.is-mobile
      .column
        img(:src="`images/roles/${trade.askerPlayer.attributes.role || 'flex'}-white.svg`" width="22" height="22")
        | {{ trade.askerPlayer.name }}
      .column.is-narrow for
      .column.is-narrow
        img(:src="`images/roles/${trade.responderPlayer.attributes.role || 'flex'}-white.svg`" width="22" height="22")
        | {{ trade.responderPlayer.name }}
      .column.is-narrow(v-if="trade.responderId === userId && trade.status === 'pending'")
        button.button.is-primary.is-small Accept
      .column.is-narrow(v-else-if="trade.askerId === userId && trade.status === 'pending'")
        button.button.is-primary.is-small Cancel
      .column.is-narrow(v-else) {{ trade.status }}
</template>

<script>
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
