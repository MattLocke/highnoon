<template lang="pug">
  .news-update
    h1.text-border(v-if="news.headline")
      a(v-bind:href="articleUrl(news.id)") {{ news.headline }}
    vue-markdown(:source="news.message")
    p By {{ news.author }}
    span.news-date {{ news.postDate | formatDate}}
</template>

<script>
import fireNews from '@/services/news'
import vueMarkdown from 'vue-markdown'

export default {
  name: 'latest-news',
  components: {
    vueMarkdown
  },
  data () {
    return {
      news: {}
    }
  },
  methods: {
    getNews: function () {
      var _this = this
      fireNews.getHomeNews().then(function (news) {
        _this.news = news
      })
    },
    articleUrl: function (id) {
      return '/#/Article/' + id
    }
  },
  mounted: function () {
    this.getNews()
  }
}
</script>

<style>
  .news-update {
    overflow-x: auto;
  }
  .news-date {
    display: block;
    margin-top: -1rem;
    font-size: .8rem;
  }
</style>
