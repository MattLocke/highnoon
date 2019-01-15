<template lang="pug">
  .box.article
    section.news-section
      h1 {{ featuredArticle.headline }}
        button.button.is-pulled-right.is-primary.is-small(@click="editArticle" v-if="isEditor") Edit
      span.category Posted under {{ featuredArticle.category }} on {{ featuredArticle.postDate | formatNewsDate }}
      .news-content
        vue-markdown(:source="featuredArticle.message")
      hr
      span {{ featuredArticle.author }}
      button.button.is-small.is-pulled-right.is-primary(@click="copyLink") Copy Share Link
      //- hr
      //- a.twitter-share-button(:href="tweetUrl" :data-url="articleUrl") Tweet
</template>

<script>
import vueMarkdown from 'vue-markdown'
import { has } from 'lodash'

export default {
  name: 'ArticleViewer',
  props: {
    featuredArticle: {
      required: true,
      type: Object
    }
  },
  computed: {
    articleUrl () {
      return `https://highnoon.gg/#/article/${this.featuredArticle.id}`
    },
    isEditor () {
      return has(this.$store.state.user.userData, 'isEditor') || has(this.$store.state.user.userData, 'isEditor')
    },
    tweetUrl () {
      // TODO: Make the tweet url work.
      const baseUrl = 'https://twitter.com/intent/tweet?text='
      const headline = encodeURI(`${this.featuredArticle.headline} - ${this.featuredArticle.blurb} ${this.articleUrl}`)
      return `${baseUrl}${headline}`
    }
  },
  components: {
    vueMarkdown
  },
  methods: {
    copyLink () {
      this.$copyText(this.articleUrl)
        .then(() => {
          this.$toast.open({
            message: 'Successfully copied the link!',
            type: 'is-success',
            position: 'is-bottom'
          })
        })
    },
    editArticle () {
      this.$router.push({ path: `/CreateNews/${this.featuredArticle.id}` })
    }
  }
}
</script>

<style lang="scss">
  .news-section {
    h1, h2, h3 {
      em {
        color: #f99e1a;
        font-style: normal;
      }
    }
    .news-content {
      h1 {
        margin: 2rem 0 -1rem;
      }
    }

  }
</style>
