<template lang="pug">
  .news-item
    .mockup
      h1 {{ article.headline }}
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
