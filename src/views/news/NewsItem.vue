<template lang="pug">
  section.news-item(@click="setActive")
    h2 {{ article.headline }}
    span {{ article.blurb }}
    span.article-date Posted under {{ article.category }} on {{ article.postDate | formatNewsDate }}
</template>

<script>
export default {
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  methods: {
    setActive () {
      this.$emit('set-article', this.article)
    }
  }
}
</script>

<style lang="scss">
.news-item {
  color: #fff;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  .article-date {
    display: block;
    font-size: .7rem;
  }
}
</style>
