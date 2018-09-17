<template lang="pug">
  .menu
    .wrap
      a.is-pulled-right(@click="showMenu = !showMenu") Menu
    .wrap(v-if="showMenu")
      .main-menu
        ul
          li SOME COOL MENU ITEM
</template>

<script>
export default {
  data () {
    return {
      showMenu: false
    }
  }
}
</script>

<style lang="scss">
  .main-menu {
    width: 25vw;
    padding-top: 1rem;
  }
</style>
