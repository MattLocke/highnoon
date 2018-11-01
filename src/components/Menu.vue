<template lang="pug">
  .menu.is-hidden-mobile(@click="toggle")
    .wrap.is-hidden-mobile(:class="{opened: showMenu, closed: !showMenu}")
      .burger-wrap
        burger(v-model="showMenu" :starts-open="false")
      .main-menu
        ul
          li(v-for="menuItem in menuItems")
            router-link.ow-font(:to="menuItem.where") {{ menuItem.name }}
        support-message
        hr
        ul
          li
            a.ow-font(@click="logOut()") Log Out
        b-notification(v-if="!isVerified" type="is-warning") You have not verified your email address.  Please check your email and verify before having access to the rest of the site!
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'

import menuService from '@/services/menu'

import supportMessage from '@/components/SupportMessage'

export default {
  components: {
    supportMessage
  },
  data () {
    return {
      showMenu: false
    }
  },
  computed: {
    menuItems () {
      return menuService.getMainMenuItems()
    },
    isVerified () {
      return this.$store.getters.isVerified
    }
  },
  methods: {
    logOut () {
      firebase.auth().signOut()
        .then(() => {
          // this.$router.push({ path: '/login' })
          location.reload()
        })
    },
    toggleMenu (value) {
      this.showMenu = value
    },
    toggle () {
      this.showMenu ? this.showMenu = false : this.showMenu = true
    }
  }
}
</script>

<style lang="scss" scoped>
  .menu {
    position: fixed;
    z-index: 900;
    top: 0;
    right: 0;
    height: 100vh;
    background-color: rgba(0,0,0,0.8);
    border-left: 1px solid rgba(255,255,255,0.3);
  }
  .burger-wrap {
    padding-left: .5rem;
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
    width: 25vw;
    animation-duration: .5s;
  }
  .closed, .closedParent {
    animation-name: closing;
    animation-duration: .5s;
    width: 2vw;
  }
  @keyframes opening {
    from { width: 2vw; }
    to { width: 25vw; }
  }
  @keyframes closing {
    from { width: 15vw; }
    to { width: 2vw; }
  }
</style>
