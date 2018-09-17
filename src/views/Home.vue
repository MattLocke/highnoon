<template lang="pug">
  .home
    .columns
      .column.is-one-quarter
        .wrap
          p News
      .column
        .wrap
          .box.article
            h1 {{ featuredArticle.headline }}
            vue-markdown(:source="featuredArticle.message")
</template>

<script>
import vueMarkdown from 'vue-markdown'
import newsService from '@/services/news'

export default {
  name: 'home',
  components: {
    vueMarkdown
  },
  data () {
    return {
      featuredArticle: {}
    }
  },
  mounted () {
    newsService.getHomeNews()
      .then(news => {
        this.featuredArticle = news
      })
  }
}
</script>

<style lang="scss">
  .mockup-block {
    background-color: #333;
  }
  .article {
    color: #fff;
  }
</style>
