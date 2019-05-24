<template lang="pug">
  .leagues
    .columns.is-marginless
      .column
        .container
          featured-leagues
</template>

<script>
import FeaturedLeagues from '@/views/leagues/Featured'

export default {
  name: 'Leagues',
  components: {
    FeaturedLeagues
  }
}
</script>
