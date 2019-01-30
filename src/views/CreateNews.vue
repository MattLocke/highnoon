<template lang="pug">
  .create-news
    .columns
      .column.is-one-third
        b-tabs(v-model="activeContentTab")
          b-tab-item(label="Create Article")
            .box
              .columns
                .column.is-half
                  b-field(label="Title")
                    b-input(v-model="newsItem.title")
                .column.is-half
                  b-field(label="Slug")
                    b-input(v-model="slug" disabled)
              b-field(label="Blurb")
                b-input(type="textarea" v-model="newsItem.blurb" rows="2")
              b-field(label="Body")
                b-input(type="textarea" v-model="newsItem.message" rows="10")
              p
                a(href="http://commonmark.org/help/") Quick Reference
              hr
              .columns
                .column.is-narrow
                  b-field(label="Category")
                    b-select(placeholder="Select a Category" v-model="newsItem.category")
                      option Analysis
                      option Editorial
                      option Interview
                      option News
                      option Spotlight
                      option Tutorial
                .column
                  b-field(label="Post Date")
                    b-datepicker(placeholder="Select Date" v-model="postDate")
              .field(v-if="user.isEditor || user.isAdmin")
                b-checkbox(v-model="newsItem.approved") Approved
              .field(v-if="user.isEditor || user.isAdmin")
                b-checkbox(v-model="newsItem.frontPage") Worthy of Home Page
              hr
              .columns
                .column.is-narrow(v-if="editId")
                  button.button.is-primary(@click="updateNews" v-if="canSave") Update News
                  button.button.is-primary(disabled v-else) Save News
                .column.is-narrow(v-else)
                  button.button.is-primary(@click="saveNews" v-if="canSave") Save News
                  button.button.is-primary(disabled v-else) Save News
                .column
                  button.button(@click="cancelCreate") Cancel
          b-tab-item(label="Upload News Image")
            news-image-uploader
      .column.is-two-thirds
        .box
          section.news-section
            h1 {{ headline }}
            p Posted under {{ newsItem.category }} on {{ cleanPostDate | formatNewsDate }}
            .news-content
              vue-markdown(:source="newsItem.message")
              span By: {{ user.signature }}
</template>

<script>
import moment from 'moment-timezone'
import vueMarkdown from 'vue-markdown'
import { has } from 'lodash'

import NewsService from '@/services/news'

import NewsImageUploader from '@/views/news/NewsImageUploader'

export default {
  name: 'CreateNews',
  components: {
    NewsImageUploader,
    vueMarkdown
  },
  data () {
    return {
      newsItem: {
        title: '',
        blurb: '',
        message: '',
        category: null,
        approved: false,
        frontPage: true
      },
      activeContentTab: null,
      editItem: {},
      postDate: null
    }
  },
  computed: {
    canSave () {
      return this.newsItem.title && this.newsItem.blurb && this.newsItem.message && this.postDate && this.newsItem.category && (this.isEditor || this.user.isWriter)
    },
    cleanPostDate () {
      return Number(moment(this.postDate).format('X'))
    },
    numberPostDate () {
      return moment(this.postDate).format('YYYYMMDD')
    },
    headline () {
      return this.newsItem.title
    },
    isEditor () {
      return has(this.$store.state.user.userData, 'isEditor')
    },
    editId () {
      return this.$route.params.articleId || null
    },
    slug: {
      get () {
        return `${moment().format('MMDYY')}-${this.newsItem.title
          .toString()
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]+/g, '')
          .replace(/--+/g, '-')
          .replace(/^-+/, '')
          .replace(/-+$/, '')}`
      },
      set () {
        // shut up.
      }
    },
    user () {
      return this.$store.getters.getUserData
    }
  },
  watch: {
    activeContentTab (val) {
      if (val) {
        this.$nextTick(() => {
          window.dispatchEvent(new Event('resize'))
        })
      }
    }
  },
  methods: {
    saveNews () {
      this.$store.dispatch('setLoading', true)
      const news = {
        postDate: Number(moment(this.postDate).format('X')),
        postDateInt: Number(this.numberPostDate),
        headline: this.headline,
        author: this.user.signature || this.user.displayName,
        slug: this.slug,
        ...this.newsItem
      }
      NewsService.addNews(news)
        .then(this.$router.push({ path: '/home' }))
        .catch(error => {
          console.error(error)
        })
    },
    updateNews () {
      this.$store.dispatch('setLoading', true)
      const news = { ...this.editItem, ...this.newsItem }

      news.id = this.editId
      news.postDate = Number(moment(this.postDate).format('X'))
      news.postDateInt = Number(this.numberPostDate)
      news.headline = this.headline
      news.slug = this.slug

      NewsService.updateNews(news)
        .then(() => {
          this.$store.dispatch('setLoading', false)
          this.$router.push({ path: '/home' })
        })
        .catch(error => {
          console.error(error)
        })
    },
    cancelCreate () {
      this.$router.push({ path: '/home' })
    }
  },
  mounted () {
    // check to see if we're editing here
    if (this.editId) {
      NewsService.getArticle(this.editId)
        .then(article => {
          this.editItem = article
          // set the newsItem fields so we can edit
          this.newsItem.title = article.headline
          this.newsItem.message = article.message
          this.newsItem.blurb = article.blurb
          this.newsItem.category = article.category
          this.newsItem.approved = article.approved
          this.newsItem.frontPage = article.frontPage
          this.postDate = new Date(article.postDate * 1000)
        })
    }
  }
}
</script>

<style lang="scss">
.news-section {
  p img {
    display: block;
    margin: 1rem auto;
  }
  table {
    margin: 1rem auto;
  }
}
</style>
