<template lang="pug">
  .create-news
    .columns
      .column.is-one-third
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
                  option News
                  option Spotlight
                  option Interview
                  option Analysis
                  option Editorial
            .column
              b-field(label="Post Date")
                b-datepicker(placeholder="Select Date" v-model="postDate")
          .field
            b-checkbox(v-model="newsItem.approved") Approved
          .field
            b-checkbox(v-model="newsItem.frontPage") Worthy of Home Page
          hr
          button.button.is-primary(@click="saveNews" v-if="canSave") Save News
          button.button.is-primary(disabled v-else) Save News
      .column.is-two-thirds
        .box
          section.news-section
            h1 {{ headline }}
            vue-markdown(:source="newsItem.message")
            span By: {{ user.signature }}
</template>

<script>
import moment from 'moment-timezone'
import vueMarkdown from 'vue-markdown'

import NewsService from '@/services/news'

export default {
  name: 'CreateNews',
  components: {
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
      postDate: null
    }
  },
  computed: {
    canSave () {
      return this.newsItem.title && this.newsItem.blurb && this.newsItem.message && this.postDate && this.newsItem.category
    },
    numberPostDate () {
      return moment(this.postDate).format('YYYYMMDD')
    },
    headline () {
      return this.newsItem.title
    },
    slug () {
      return `${moment().format('MMDYY')}-${this.newsItem.title
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '')}`
    },
    user () {
      return this.$store.getters.getUserData
    }
  },
  methods: {
    saveNews () {
      this.$store.dispatch('setLoading', true)
      const news = {
        postDate: Number(moment(this.postDate).format('X')),
        postDateInt: Number(this.numberPostDate),
        headline: this.headline,
        slug: this.slug,
        ...this.newsItem
      }
      NewsService.addNews(news)
        .then(this.$router.push({ path: '/home' }))
        .catch((error) => {
          console.error(error)
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
