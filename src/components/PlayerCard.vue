<template lang="pug">
  .player-card(:style="{'background-color': `#${primaryColor}`}")
    .columns.player-title.is-marginless.is-gapless.is-mobile(v-if="!player")
      .column
        h3.ow-font N/A
    div.is-hidden-mobile(v-if="!player && !hidePhoto")
      img.img(src="https://bnetcmsus-a.akamaihd.net/cms/page_media/S02042JXNHF81515718127993.png")
      span.fantasy-points.has-text-centered 0
    .columns.player-title.is-marginless.is-gapless.is-mobile(v-else)
      .column
        h3.ow-font(@click="seeStats = !seeStats") {{ player.name }}
        //- p.ow-font.is-hidden-desktop(@click="seeStats = !seeStats") {{ player.name }}
      .column.is-narrow
        img.role-image(:src="`images/roles/${player.attributes.role || 'flex'}-white.svg`")
    div.is-hidden-mobile(v-if="!seeStats && player && !hidePhoto")
      img.img(:src="player.headshot")
      span.fantasy-points.has-text-centered {{ score }}
    .stats(v-if="seeStats && player")
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
    placeholder: {
      type: Boolean,
      default: false
    },
    player: {
      type: Object,
      default: null
    },
    hidePhoto: {
      type: Boolean,
      default: false
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
      default: '222'
    },
    score: {
      type: Number,
      default: 0
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
    position: relative;
    overflow: hidden;
    min-width: 80px;
    max-width: 150px;
    .player-title, .fantasy-points {
      background-color: #333;
      padding-top: .25rem;
      padding-left: .25rem;
    }
    .fantasy-points {
      width: 100%;
      display: block;
      margin-top: -.5rem;
      margin-bottom: -.25rem;
      position: relative;
      z-index: 3;
      height: 1.2rem;
      line-height: .6rem;
    }
    h3 {
      font-size: 1.2rem;
      line-height: 1.6rem;
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
      height: 1.2rem;
      width: 1.2rem;
      line-height: 1.2rem;
      margin-bottom: -3px;
    }
    .img {
      z-index: 2;
      position: relative;
    }
  }
</style>
