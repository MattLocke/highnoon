<template lang="pug">
  .social
    a.twitter-share-button.is-pulled-right(v-bind:href="twitterUrl()" data-size="large") Tweet
</template>

<script>
export default {
  name: 'social',
  props: ['leagueId'],
  data () {
    return {
    }
  },
  methods: {
    twitterUrl: function () {
      var baseUrl = 'https://twitter.com/intent/tweet?text='
      var text = encodeURI('Come check out our fantasy Overwatch pick\'em league! #hnp #overwatch')
      var url = baseUrl + text
      return url
    }
  }
}
</script>
