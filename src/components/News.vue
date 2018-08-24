<template lang="pug">
  .news
    .container
      section.section
        .box(v-if="!addNewsMode && canCreateNews")
          button.button.positive-button(v-on:click="addNewsMode = true") Add News
        .box(v-if="addNewsMode")
          h1.text-border {{ news.headline }}
          p {{ news.blurb }}
          vue-markdown(:source="news.message")
          .news-wrapper
            hr
            input.input.is-large(type="text" v-model="news.headline" placeholder="Headline")
            textarea.textarea(v-model="news.blurb", placeholder="Type a short summary here, will be used in the future for displaying a list of articles.")
            span This uses markdown.
              a(href="http://commonmark.org/help/" target="_blank") Here is a quick reference guide.
            textarea.textarea(row="8" v-model="news.message" placeholder="News article goes here!") {{ news.message }}
            .field
              .control
                label.label Author
                  input.input(v-model="news.author")
            .field(v-if="canApproveNews")
              .control
                label.checkbox
                  input(type="checkbox" v-model="news.approved")
                  |  Approved
            .field(v-if="canApproveNews")
              .control
                label.checkbox
                  input(type="checkbox" v-model="news.frontPage")
                  |  Home Page Worthy
            button.button.positive-button(v-on:click="addNews(news)") Save and close
            button.button.negative-button.is-pulled-right(v-on:click="addNewsMode = false") Cancel
            hr
        .box(v-for="article in articles" v-if="article.approved || canApproveNews")
          .news-preview(v-bind:class="{'preview-off': article.seeFull, 'preview-on': !article.seeFull}")
            h1.text-border(v-if="article.headline")
              a(v-bind:href="articleUrl(article.id)") {{ article.headline }}
            vue-markdown(:source="article.message")
            p By {{ article.author }} on {{ article.postDate | formatDate}}
            .news-wrapper(v-if="showEdit(article.id)")
              hr
              input.input.is-large(type="text" v-model="article.headline" placeholder="Headline")
              textarea.textarea(v-model="article.blurb", placeholder="Type a short summary here, will be used in the future for displaying a list of articles.")
              span This uses markdown.
                a(href="http://commonmark.org/help/" target="_blank") Here is a quick reference guide.
              textarea.textarea(row='4' v-model="article.message") {{ article.message }}
              .field
                .control
                  label.label Author
                    input.input(v-model="article.author")
              .field
                .control
                  label.checkbox
                    input(type="checkbox" v-model="article.approved")
                    |  Approved
              .field
                .control
                  label.checkbox
                    input(type="checkbox" v-model="article.frontPage")
                    |  Home Page Worthy
              button.button.positive-button(v-on:click="updateNews(article)") Save and close
              button.button.negative-button.is-pulled-right(v-on:click="hideEdit(article.id)") Cancel
              hr
          .news-footer(v-if="!article.seeFull")
            a.button.positive-button.is-small.is-pulled-right(v-on:click="article.seeFull = true") Read Full Article
          .news-footer(v-if="article.seeFull && !articleId")
            a.button.positive-button.is-small.is-pulled-right(v-on:click="article.seeFull = false") Collapse
          .news-wrapper(v-if="canApproveNews")
            a(v-on:click="activeEdit = article.id" v-if="!showEdit(article.id)") Edit
</template>

<script>
import firebase from 'firebase'
import fireUser from '@/services/user'
import fireNews from '@/services/news'
import vueMarkdown from 'vue-markdown'

export default {
  name: 'news',
  components: {
    vueMarkdown
  },
  data () {
    return {
      isAdmin: false,
      addNewsMode: false,
      activeEdit: 0,
      news: {
        message: '',
        headline: '',
        blurb: '',
        author: '',
        postDate: '',
        frontPage: false,
        approved: false,
        id: 0
      },
      articleId: '',
      articles: [],
      showNewsEdit: false,
      user: {},
      userData: {
        isAdmin: false,
        isEditor: false
      }
    }
  },
  computed: {
    canCreateNews: function () {
      if (this.userData.isAdmin || this.userData.isEditor || this.userData.isWriter) return true
    },
    canApproveNews: function () {
      if (this.userData.isAdmin || this.userData.isEditor) return true
    }
  },
  methods: {
    articleUrl: function (id) {
      return '/#/Article/' + id
    },
    addNews: function () {
      var _this = this
      _this.news.postDate = Date.now() / 1000
      fireNews.addNews(this.news).then(function (newsId) {
        _this.news.id = newsId
        _this.articles.unshift(_this.news)
        _this.addNewsMode = false
        _this.resetNews()
      })
    },
    updateNews: function (news) {
      var _this = this
      news.postDate = Date.now() / 1000
      fireNews.updateNews(news).then(function () {
        _this.hideEdit(news.id)
      })
    },
    resetNews: function () {
      this.news = {
        message: '',
        author: '',
        postDate: '',
        frontPage: false,
        approved: false,
        id: 0
      }
    },
    hideEdit: function () {
      this.activeEdit = 0
    },
    showEdit: function (id) {
      return this.activeEdit === id
    },
    getNews: function () {
      var _this = this
      fireNews.getNews().then(function (news) {
        news.forEach(function (item) {
          item.seeFull = false
        })
        _this.articles = news
      })
    },
    getArticle: function () {
      var _this = this
      fireNews.getArticle(this.articleId).then(function (article) {
        article.seeFull = true
        _this.articles.push(article)
      })
    }
  },
  mounted: function () {
    this.articleId = this.$route.params.articleId
    var _this = this
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        _this.user = user
        fireUser.getProfile(user.uid).then(function (info) {
          _this.userData = info
          _this.news.author = info.signature
        })
      }
    })
    if (this.articleId) _this.getArticle()
    else _this.getNews()
  }
}
</script>

<style lang="scss" scoped>
  @import '../variables.scss';
  .news-footer {
    border-top: 1px solid $owp-orange;
    margin-top: 1rem;
    padding: .4rem 0;
  }
  h2 {
    color: $owp-orange;
  }

  .preview-on {
    max-height: 400px;
    overflow: hidden;
    img {
      display: none;
    }
  }
</style>
