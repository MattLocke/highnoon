<template lang="pug">
  .leagues
    .columns.is-marginless
      left-bar
        section
          h2 Pick'em Leagues
          p You currently have no Picke'em leagues.
        section
          h2 Fantasy Leagues
          p You currently have no Fantasy leagues.
        section
          h2 Create A League
        section
          router-link.button.is-primary(to="/createLeague") Create League
        section
          router-link.button.is-primary(to="/draft") Test Draft
      .column
        .container
          section
            h1 Leagues
</template>

<script>
export default {
}
</script>
