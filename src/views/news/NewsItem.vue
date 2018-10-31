<template lang="pug">
  section.news-item(@click="setActive")
    h3 {{ article.headline }}
    span {{ article.postDate | formatNewsDate }}
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
}
</style>
