<template lang="pug">
  .player-card(:style="{'background-color': `#${primaryColor}`}")
    .columns.player-title.is-marginless.is-gapless.is-mobile
      .column
        h3.ow-font(@click="seeStats = !seeStats") {{ player.name }}
        //- p.ow-font.is-hidden-desktop(@click="seeStats = !seeStats") {{ player.name }}
      .column.is-narrow
        img.role-image(:src="`images/roles/${player.attributes.role}-white.svg`")
    div(v-if="!seeStats")
      img.img(:src="player.headshot")
      span.fantasy-points.has-text-centered {{ Math.round(Math.random() * (1500 - 700) + 700) }}
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
    },
    primaryColor: {
      type: String,
      default: '000'
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
    border-radius: 4px;
    padding-bottom: .25rem;
    height: 100%;
    position: relative;
    overflow: hidden;
    .player-title, .fantasy-points {
      background-color: #333;
      padding-top: .25rem;
      padding-left: .25rem;
    }
    .fantasy-points {
      width: 100%;
      display: block;
      margin-top: -.5rem;
      position: relative;
      z-index: 3;
      height: 2rem;
    }
    h3 {
      font-size: 2rem;
      line-height: 2rem;
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
    .role-image {
      height: 2rem;
      width: 2rem;
    }
    .img {
      z-index: 2;
      position: relative;
    }
  }
</style>
