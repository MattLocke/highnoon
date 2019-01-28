<template lang="pug">
  .leagues
    .columns.is-marginless
      left-bar
        your-leagues(:userId="userId")
      .column
        .container
          h1 Please select a league from the menu.
          p If you have not yet joined a league, you may create one or join a friends!
</template>

<script>
import YourLeagues from '@/views/leagues/YourLeagues'

export default {
  name: 'Leagues',
  components: {
    YourLeagues
  },
  computed: {
    userId () {
      return this.$store.getters.getUserId
    }
  }
}
</script>
