<template lang="pug">
  .roster-position
    .columns.is-mobile
      .column.is-narrow(v-if="isRight")
        span.player-score.ow-font {{ score | playerScore }}
      .column(v-if="isRight")
      .column.is-narrow(v-if="isRight")
        h3 {{ name }}
          img(:src="roleImg" width="16" height="16")
      .column(v-else)
        h3
          img(:src="roleImg" width="16" height="16")
          | {{ name }}
      .column.is-narrow(v-if="!isRight")
        span.player-score.ow-font {{ score | playerScore }}
</template>

<script>
export default {
  name: 'RosterPosition',
  props: {
    score: {
      type: Number,
      default: 0
    },
    isRight: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      default: 'flex'
    }
  },
  computed: {
    roleImg () {
      if (this.role !== 'captain') return `images/roles/${this.role}-white.svg`
      else return 'images/roles/captain-white.svg'
    }
  }
}
</script>
