<template lang="pug">
  .player-card(:style="{'background': backgroundColor}")
    .columns.player-title.is-marginless.is-gapless.is-mobile(v-if="!player")
      .column
        h3.ow-font N/A
    div.is-hidden-mobile(v-if="!player && !hidePhoto")
      img.img(src="https://bnetcmsus-a.akamaihd.net/cms/page_media/S02042JXNHF81515718127993.png")
      span.fantasy-points.has-text-centered 0
    .columns.player-title.is-marginless.is-gapless.is-mobile(v-else)
      .column
        h3.ow-font(@click="seeStats = !seeStats") {{ player.name }}
      .column.is-narrow
        img.role-image(:src="`images/roles/${player.attributes.role || 'flex'}-white.svg`")
    div.headshot.is-hidden-mobile(v-if="!seeStats && player && !hidePhoto")
      img.img(:src="player.headshot")
      div.fantasy-points.ow-font
        .columns
          .column
            span.orange {{ getScore(player.id) | playerScore }}
          .column.is-narrow
            img(:src="`images/teams/${player.team}.svg`")
    .stats(v-if="seeStats && player")
      span.is-proper Role: {{ player.attributes.role }}
      .heroes(v-if="hasHeroes(player)")
        span Heroes:
        ul
          li.is-proper(v-for="hero in player.attributes.heroes") {{ hero }}
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
  computed: {
    backgroundColor () {
      if (this.player) {
        const team = this.teams.find(t => t.abbreviatedName === this.player.team)
        if (team) return `linear-gradient(#${team.primaryColor === '000000' ? team.secondaryColor : team.primaryColor}, #111111)`
      }
      return 'linear-gradient(#000000, #000000)'
    },
    currentWeek () {
      return this.$store.getters.getCurrentWeek
    },
    playerScores () {
      return this.$store.getters.getPlayerScores || {}
    },
    teams () {
      return this.$store.getters.getTeams
    }
  },
  methods: {
    getScore (playerId) {
      return Number(this.playerScores[playerId]) || 0
    },
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
    position: relative;
    overflow: hidden;
    min-width: 80px;
    max-width: 150px;
    .headshot {
      position: relative;
    }
    .player-title, .fantasy-points {
      background-color: #333;
      padding-top: .25rem;
      padding-left: .25rem;
    }
    .fantasy-points {
      margin-top: -.35rem;
      font-size: 1.5rem;
      line-height: 1.2rem;
      img {
        width: 20px;
        height: 20px;
        margin-right: .25rem;
        margin-bottom: .25rem;
      }
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
