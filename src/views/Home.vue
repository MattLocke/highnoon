<template lang="pug">
  .home
    .columns.is-marginless
      left-bar
        hr
        section(v-if="isEditor")
          router-link(to="/CreateNews") Create News
        news-item(v-for="article in latestArticles" :key="article.id" :article="article" v-on:set-article="setArticle")
      top-bar
        section(v-if="isEditor")
          router-link(to="/CreateNews") Create News
        news-item(v-for="article in latestArticles" :key="article.id" :article="article" v-on:set-article="setArticle")
      .column
        .wrap
          article-viewer(:featuredArticle="featuredArticle")
</template>

<script>
import vueMarkdown from 'vue-markdown'
import { has } from 'lodash'

import newsService from '@/services/news'

import newsItem from '@/views/news/NewsItem'
import articleViewer from '@/views/news/ArticleViewer'

export default {
  name: 'home',
  components: {
    vueMarkdown,
    newsItem,
    articleViewer
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
    },
    articleUrl () {
      return `https://highnoon.gg/#/article/${this.featuredArticle.id}`
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
