<template lang="pug">
  .home
    .columns.is-marginless
      left-bar
        section(v-if="isEditor")
          .columns
            .column
              router-link(to="/CreateNews") Create News
            .column
              a(@click="viewPending = !viewPending" v-if="viewPending") View Current
              a(@click="viewPending = !viewPending" v-else) View Pending
        .wrap(v-if="viewPending")
          news-item(v-for="article in pendingArticles" :key="article.id" :article="article" v-on:set-article="setArticle")
        .wrap(v-else)
          news-item(v-for="article in latestArticles" :key="article.id" :article="article" v-on:set-article="setArticle")

      top-bar(toggle-text="View More News")
        section(v-if="isEditor")
          .columns
            .column
              router-link(to="/CreateNews") Create News
            .column
              a(@click="viewPending = !viewPending" v-if="viewPending") View Current
              a(@click="viewPending = !viewPending" v-else) View Pending
        .wrap(v-if="viewPending")
          news-item(v-for="article in pendingArticles" :key="article.id" :article="article" v-on:set-article="setArticle")
        .wrap(v-else)
          news-item(v-for="article in latestArticles" :key="article.id" :article="article" v-on:set-article="setArticle")
      .column
        .wrap.container
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
      pendingArticles: [],
      featuredArticle: {},
      viewPending: false
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
    if (this.isEditor) {
      newsService.getPendingNews()
        .then(articles => {
          this.pendingArticles = articles
        })
    }
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
