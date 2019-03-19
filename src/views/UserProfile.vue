<template lang="pug">
  .user-profile
    h1 Profile for: {{ userProfile.displayName }}
</template>

<script>
import UserService from '@/services/user'

export default {
  name: 'UserProfile',
  data () {
    return {
      userProfileId: this.$route.params.userId,
      userProfile: {}
    }
  },
  watch: {
    userProfileId: {
      immediate: true,
      handler (val) {
        if (val) {
          UserService.getProfile(val)
            .then((profile) => {
              this.userProfile = profile
            })
        }
      }
    }
  }
}
</script>
