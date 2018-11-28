<template lang="pug">
  .player-card
    h3.ow-font.is-hidden-mobile(@click="seeStats = !seeStats") {{ player.name }}
    p.ow-font.is-hidden-desktop(@click="seeStats = !seeStats") {{ player.name }}
    img.img(:src="player.headshot" v-if="!seeStats")
    .stats(v-else)
      span.is-proper Role: {{ player.attributes.role }}
      .heroes(v-if="hasHeroes(player)")
        span Heroes:
        ul
          li.is-proper(v-for="hero in player.attributes.heroes") {{ hero }}
    button.button.is-primary.is-small(
      v-if="showRemove"
      @click="$emit('remove')") Remove
</template>

<script>
import { isEmpty } from 'lodash'

export default {
  name: 'PlayerCard',
  props: {
    player: {
      type: Object,
      required: true
    },
    showStats: {
      type: Boolean,
      default: false
    },
    showRemove: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      seeStats: false
    }
  },
  methods: {
    hasHeroes (player) {
      if (player && player.attributes) return !isEmpty(player.attributes.heroes)
      return false
    }
  },
  watch: {
    showStats: {
      immediate: true,
      handler (val) {
        this.seeStats = this.showStats
      }
    }
  }
}
</script>

<style lang="scss">
  .player-card {
    border: 1px solid #fff;
    background-color: rgba(255,255,255,0.3);
    text-align: center;
    border-radius: 4px;
    padding-bottom: .25rem;
    h3 {
      font-size: 2rem;
    }
    .stats {
      background-color: #30375f;
      text-align: left;
      padding: .5rem;
      margin-bottom: .25rem;
      ul {
        margin-left: .5rem;
      }
    }
    h3.ow-font, p.ow-font {
      cursor: pointer;
    }
  }
</style>
