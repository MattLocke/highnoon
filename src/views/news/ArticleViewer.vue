<template lang="pug">
  .box.article
    section.news-section
      h1 {{ featuredArticle.headline }}
        button.button.is-pulled-right.is-primary.is-small(@click="editArticle" v-if="isEditor") Edit
      span.category Posted under {{ featuredArticle.category }} on {{ featuredArticle.postDate | formatNewsDate }}
      vue-markdown(:source="featuredArticle.message")
      hr
      span {{ featuredArticle.author }}
      button.button.is-small.is-pulled-right.is-primary(@click="copyLink") Copy Share Link
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
