<template lang="pug">
  .player-profile
    .box(v-if="profile")
      h1 {{ profile.name }}
      img(:src="profile.headshot")

</template>

<script>
import playerService from '@/services/players'

export default {
  data () {
    return {
      profile: null
    }
  },
  mounted () {
    playerService.getPlayer(this.$route.params.handle)
      .then(player => {
        this.profile = player
      })
  }
}
</script>
