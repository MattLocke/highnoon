<template lang="pug">
  .profile
    .columns
      left-bar
        .box
          h1 Profile View
      .column
        achievements
        settings
        social
</template>

<script>
import Achievements from '@/views/profile/Achievements'
import Settings from '@/views/profile/Settings'
import Social from '@/views/profile/Social'

export default {
  components: {
    Achievements,
    Settings,
    Social
  }
}
</script>
