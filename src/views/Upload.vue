<template lang="pug">
  .upload
    news-image-uploader(v-if="user.isAdmin || user.isEditor || user.isWriter")
</template>

<script>
import NewsImageUploader from '@/views/news/NewsImageUploader'

export default {
  name: 'Upload',
  components: {
    NewsImageUploader
  },
  computed: {
    user () {
      return this.$store.getters.getUserData
    }
  }
}
</script>
