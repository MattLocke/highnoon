<template lang="pug">
  .leagues
    .columns.is-marginless
      left-bar
        your-leagues(:userId="userId")
      .column
        .container
          featured-leagues
</template>

<script>
import FeaturedLeagues from '@/views/leagues/Featured'
import YourLeagues from '@/views/leagues/YourLeagues'

export default {
  name: 'Leagues',
  components: {
    FeaturedLeagues,
    YourLeagues
  },
  computed: {
    userId () {
      return this.$store.getters.getUserId
    }
  }
}
</script>
