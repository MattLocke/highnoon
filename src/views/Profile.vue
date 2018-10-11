<template lang="pug">
  .profile
    .columns
      .column.is-one-quarter
        .box
          h1 Profile View
      .column
        achievements
        settings
</template>

<script>
import Achievements from '@/views/profile/Achievements'
import Settings from '@/views/profile/Settings'

export default {
  components: {
    Achievements,
    Settings
  }
}
</script>
