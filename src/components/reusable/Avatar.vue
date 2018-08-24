<template lang="pug">
  .avatar
    img(v-bind:src="imageUrl")
</template>

<script>
import md5 from 'md5-js'

export default {
  name: 'avatar',
  props: ['width', 'email'],
  data () {
    return {
    }
  },
  computed: {
    imageUrl: function () {
      var lower = this.email.toLowerCase()
      var hash = md5(lower)
      return 'https://www.gravatar.com/avatar/' + hash + '?s=' + this.width
    }
  }
}
</script>

<style>
</style>
