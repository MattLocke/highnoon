<template lang="pug">
  .news-update
    vue-markdown(:source="news.message")
    .news-wrapper(v-if="showNewsEdit")
      hr
      span This uses markdown.  
        a(href="http://commonmark.org/help/" target="_blank") Here is a quick reference guide.
      textarea.textarea(row='4' v-model="news.message") {{ news.message }}
      button.button.positive-button(v-on:click="updateNews()") Save and close
    .news-wrapper(v-if="!showNewsEdit && isAdmin")
      a(v-on:click="showNewsEdit = true") Edit News
</template>

<script>
  import fireNews from '@/services/news'
  import vueMarkdown from 'vue-markdown'
  
  export default {
    name: 'news-update',
    props: ['isAdmin'],
    components: {
      vueMarkdown
    },
    data () {
      return {
        news: {
          message: ''
        },
        showNewsEdit: false
      }
    },
    methods: {
      updateNews: function () {
        var _this = this
        fireNews.updateNews(_this.news).then(function () {
          _this.showNewsEdit = false
        })
      },
      getNews: function () {
        var _this = this
        fireNews.getHomeNews().then(function (news) {
          _this.news = news
        })
      }
    },
    mounted: function () {
      this.getNews()
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../variables.scss';
  
  h2 {
    color: $owp-orange;
  }
</style>