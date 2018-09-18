<template lang="pug">
  .menu
    .wrap
      a.is-pulled-right(@click="showMenu = !showMenu") Menu
    .wrap(v-if="showMenu")
      .main-menu
        ul
          li
            router-link(to="/home") News
          li
            router-link(to="/fantasy") Fantasy
          li
            router-link(to="/leagueFantasy") Fantasy League
          li
            router-link(to="/leaguePickem") Pickem Leagues
          li
            router-link(to="/picks") My Picks
          li
            router-link(to="/profile") My Profile
          li
            a(@click="logOut()") Log Out
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  data () {
    return {
      showMenu: false
    }
  },
  methods: {
    logOut () {
      firebase.auth().signOut()
        .then(() => {
          this.$router.push({ path: '/login' })
        })
    }
  }
}
</script>

<style lang="scss">
  .main-menu {
    width: 25vw;
    padding: 1rem;
    background-color: rgba(0,0,0,0.3);
  }
</style>
