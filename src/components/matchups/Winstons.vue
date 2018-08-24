<template lang="pug">
  .winstons
    .box(v-if="matchId")
      .media
        figure.media-left
          p.image.is-48x48
            img(src="/assets/img/winstons-lab.png")
        .media-content
          .content
            a(v-bind:href="winstonsMatchUrl" target="_blank")
              h3.overwatch-font View Match Data on Winstons
              p Learn everything you want to know about the matchup at Winstons Lab!
</template>

<script>
import winston from '@/services/winston'

export default {
  name: 'winstonslab',
  props: ['matchId'],
  data () {
    return {
    }
  },
  computed: {
    winstonsMatchUrl: function () {
      return winston.matchUrl(this.matchId)
    }
  }
}
</script>
