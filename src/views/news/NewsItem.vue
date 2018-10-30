<template lang="pug">
  section.news-item
    h3 {{ article.headline }}
    span {{ article.postDate | formatDate }}
</template>

<script>
export default {
  props: {
    article: {
      type: Object,
      required: true
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
