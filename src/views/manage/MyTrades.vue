<template lang="pug">
  .my-trades
    p(v-if="pendingTrades.length") Some Trades
    .left-bar-item(v-else) You Have No Pending Trades
    hr
    b-field
      button.button.is-primary.is-small(@click="createTradeMode = !createTradeMode" :class="{'is-pulled-right': createTradeMode}") {{ createTradeMode ? 'Cancel' : 'Create New Trade' }}
    .initiate-trade(v-if="createTradeMode")
      b-field(label="Other Team Players")
        b-select(placeholder="Select a Category" v-model="trade.theirPlayer")
          option(v-for="player in otherPlayers" :value="player") {{ player.name }}
      b-field(label="Your Players")
        b-select(placeholder="Select a Category" v-model="trade.yourPlayer")
          option(v-for="player in myPlayers" :value="player") {{ player.name }}
      b-field
        button.button.is-primary Request Trade
</template>

<script>
export default {
  name: 'MyTrades',
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
      pendingTrades: [],
      trade: {
        theirPlayer: {},
        yourPlayer: {}
      }
    }
  }
}
</script>
