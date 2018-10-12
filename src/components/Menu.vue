<template lang="pug">
  .menu(v-if="currentUser")
    .wrap
      burger.is-pulled-right(v-model="showMenu")
    .wrap(:class="{opened: showMenu, closed: !showMenu}")
      .main-menu
        ul
          li(@click="showMenu = false")
            router-link.ow-font(to="/home") News
          li(@click="showMenu = false")
            router-link.ow-font(to="/fantasy") Fantasy
          li(@click="showMenu = false")
            router-link.ow-font(to="/leagueFantasy") Fantasy League
          li(@click="showMenu = false")
            router-link.ow-font(to="/leaguePickem") Pickem Leagues
          li(@click="showMenu = false")
            router-link.ow-font(to="/picks") My Picks
          li(@click="showMenu = false")
            router-link.ow-font(to="/profile") My Profile
          li(@click="showMenu = false")
            router-link.ow-font(to="/createLeague") Create League
          li(@click="showMenu = false")
            router-link.ow-font(to="/messages") Messages
          li(@click="showMenu = false")
            router-link.ow-font(to="/staff") Staff
        hr
        ul
          li(@click="showMenu = false")
            a.ow-font(@click="logOut()") Log Out
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
  computed: {
    currentUser () {
      return firebase.auth().currentUser
    }
  },
  methods: {
    logOut () {
      firebase.auth().signOut()
        .then(() => {
          this.$router.push({ path: '/login' })
        })
    },
    toggleMenu (value) {
      this.showMenu = value
    }
  }
}
</script>

<style lang="scss">
  .menu {
    position: fixed;
    z-index: 900;
    top: 0;
    right: 0;
    height: 100vh;
    background-color: rgba(0,0,0,0.8);
    border-left: 1px solid rgba(255,255,255,0.3);
  }
  .main-menu {
    width: 25vw;
    padding: 1rem 1rem 1rem 2vw;
    background-color: rgba(0,0,0,0.3);
    margin-top: 2rem;
    ul {
      li {
        a {
          display: block;
          padding: .25rem .5rem;
          color: #fff;
          font-size: 1.4rem;
          &:hover {
            background-color: rgba(255,255,255,0.3);
          }
        }
      }
    }
  }
  .closed li, .closed hr {
    display: none;
  }
  .opened, .openedParent {
    animation-name: opening;
    width: 15vw;
    animation-duration: .5s;
  }
  .closed, .closedParent {
    animation-name: closing;
    animation-duration: .5s;
    width: 2vw;
  }
  @keyframes opening {
    from { width: 2vw; }
    to { width: 15vw; }
  }
  @keyframes closing {
    from { width: 15vw; }
    to { width: 2vw; }
  }
</style>
