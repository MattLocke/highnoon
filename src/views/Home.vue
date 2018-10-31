<template lang="pug">
  .home
    .columns
      left-bar
        hr
        section(v-if="isEditor")
          router-link(to="/CreateNews") Create News
        news-item(v-for="article in latestArticles" :key="article.id" :article="article" v-on:set-article="setArticle")
      .column
        .wrap
          .box.article
            section.news-section
              h1 {{ featuredArticle.headline }}
              vue-markdown(:source="featuredArticle.message")
              hr
              span {{ featuredArticle.author }}
</template>

<script>
import vueMarkdown from 'vue-markdown'
import { has } from 'lodash'

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
      latestArticles: [],
      featuredArticle: {}
    }
  },
  computed: {
    isEditor () {
      return has(this.$store.state.user.userData, 'isEditor')
    }
  },
  methods: {
    setArticle (article) {
      this.featuredArticle = article
    }
  },
  mounted () {
    this.$store.dispatch('setLoading', true)
    newsService.getNews()
      .then(articles => {
        this.latestArticles = articles
        this.featuredArticle = articles[0]
        this.$store.dispatch('setLoading', false)
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
