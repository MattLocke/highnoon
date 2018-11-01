<template lang="pug">
  .article
    article-viewer(:featuredArticle="featuredArticle" v-if="isValidArticle")
    p(v-else) Sorry, this doesn't appear to be a valid article!
</template>

<script>
import { isEmpty } from 'lodash'

import NewsService from '@/services/news'
import articleViewer from '@/views/news/ArticleViewer'

export default {
  name: 'Article',
  components: {
    articleViewer
  },
  data () {
    return {
      featuredArticle: {}
    }
  },
  computed: {
    articleId () {
      return this.$route.params.articleId
    },
    isValidArticle () {
      return !isEmpty(this.featuredArticle)
    }
  },
  mounted () {
    // get the article based on the route param
    NewsService.getArticle(this.articleId)
      .then(article => { this.featuredArticle = article })
      .catch(() => {
        this.$toast.open({
          message: 'We were unable to find that article!',
          type: 'is-danger',
          position: 'is-bottom'
        })
      })
  }
}
</script>
