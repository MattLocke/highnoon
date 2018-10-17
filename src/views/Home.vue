<template lang="pug">
  .home
    .columns
      left-bar
        p News
        news-item(v-for="article in latestArticles" :key="article.id" :article="article")
      .column
        .wrap
          .box.article
            h1 {{ featuredArticle.headline }}
            vue-markdown(:source="featuredArticle.message")
</template>

<script>
import vueMarkdown from 'vue-markdown'
import newsService from '@/services/news'

import newsItem from '@/views/news/NewsItem'

export default {
  name: 'home',
  components: {
    vueMarkdown,
    newsItem
  },
  data () {
    return {
      featuredArticle: {},
      latestArticles: []
    }
  },
  mounted () {
    this.$store.dispatch('setLoading', true)
    newsService.getHomeNews()
      .then(news => {
        this.featuredArticle = news
      })
      .then(newsService.getNews()
        .then(articles => {
          this.latestArticles = articles
          this.$store.dispatch('setLoading', false)
        })
      )
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
