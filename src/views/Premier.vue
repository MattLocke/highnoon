<template lang="pug">
  .premier-stats.container(v-if="isPremier")
    h2 Premier Stats Page
    span If you are having trouble viewing these, please contact Gig on discord.
    b-tabs(v-model="activeContentTab")
      b-tab-item(label="Overview")
        iframe.iframe(:src="`${base}${overview}`" width="100%" :height="iframeHeight")
      b-tab-item(label="Teams")
        iframe.iframe(:src="`${base}${teams}`" width="100%" :height="iframeHeight")
      b-tab-item(label="Players")
        iframe.iframe(:src="`${base}${players}`" width="100%" :height="iframeHeight")
      b-tab-item(label="Heroes")
        iframe.iframe(:src="`${base}${heroes}`" width="100%" :height="iframeHeight")
      b-tab-item(label="StandardDraft")
        iframe.iframe(:src="`${base}${standard}`" width="100%" :height="iframeHeight")
      b-tab-item(label="More")
        h3 More features coming soon!
        p Eventually this will turn into a really cool hub to let you discover all sorts of perks!  I want to thank you from the bottom of my heart for supporting this dream.  Though it'll probably never be enough to become my day job, it's great to know others believe in the dream of working on an awesome fantasy platform.  So thank you so much!  <3
        p - Soul
</template>

<script>
export default {
  name: 'PremierStats',
  data () {
    return {
      base: 'https://datastudio.google.com/embed/reporting/13M8W4CCiws4PeZSBswdY3y_iC4dgNFjV/page/',
      overview: 'Mmei',
      teams: '8oxi',
      players: 'Z2Ij',
      heroes: 'TpAk',
      standard: 'qyjj'
    }
  },
  computed: {
    iframeHeight () {
      return window.innerHeight - 240
    },
    isPremier () {
      return (this.user && this.user.isPremier)
    },
    user () {
      return this.$store.getters.getUserData
    }
  }
}
</script>

<style lang="scss">
  .premier {
    .iframe {
      border: none;
    }
  }
</style>
