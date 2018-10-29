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
          b-field(label="Body")
            b-input(type="textarea" v-model="newsItem.message" rows="10")
          p
            a(href="http://commonmark.org/help/") Quick Reference
          hr
          .columns
            .column.is-narrow
              b-field(label="Category")
                b-select(placeholder="Select a Category")
                  option League News
                  option SFS
                  option DAL
                  option HOU
            .column
              b-field(label="Post Date")
                b-datepicker(placeholder="Select Date")
          .field
            b-checkbox(v-model="newsItem.approved") Approved
          .field
            b-checkbox(v-model="newsItem.homePage") Worthy of Home Page
          hr
          button.button.is-primary Save News
      .column.is-two-thirds
        .box
          section.news-section
            vue-markdown(:source="headline")
            vue-markdown(:source="newsItem.message")
            span By: {{ user.signature }}
</template>

<script>
import vueMarkdown from 'vue-markdown'

export default {
  name: 'CreateNews',
  components: {
    vueMarkdown
  },
  data () {
    return {
      newsItem: {
        title: '',
        message: null,
        approved: false,
        homePage: true
      }
    }
  },
  computed: {
    headline () {
      return `# ${this.newsItem.title}`
    },
    slug () {
      return this.newsItem.title
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '')
    },
    user () {
      return this.$store.getters.getUserData
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
