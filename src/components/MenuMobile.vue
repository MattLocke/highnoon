<template lang="pug">
  .mobile-menu.is-hidden-tablet
    .open-icon(v-if="!showMenu")
        img.logo(src="images/high_noon_white.svg" @click="toggle")
    .wrap(:class="{opened: showMenu, closed: !showMenu}" @click="toggle")
      .main-mobile-menu(v-if="showMenu")
        ul
          li(v-for="menuItem in menuItems")
            h2
              router-link.ow-font(:to="menuItem.where" v-if="canSee(menuItem)") {{ menuItem.name }}
        //- support-message
        hr
        ul
          li(v-if="currentUser")
            a.ow-font(@click="logOut()") Log Out
          li(v-else)
            router-link(to="/login") Log In
          li
            h2
              a(href="https://discord.gg/H5bNcYD") High Noon Discord
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'

import menuService from '@/services/menu'

import supportMessage from '@/components/SupportMessage'

export default {
  name: 'MobileMenu',
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
    menuMessage () {
      return menuService.getMenuMessage()
    },
    currentUser () {
      return this.$store.getters.isLoggedIn
    }
  },
  methods: {
    canSee (menuItem) {
      if (menuItem.requiresAuth && !this.currentUser) return false
      return true
    },
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
  .mobile-menu {
    position: fixed;
    bottom: 0;
    width: 100vw;
    z-index: 900;
    background-color: rgba(0,0,0,0.95);
    .open-icon {
      .logo {
        height: 6vh;
        width: 6vh;
        margin: -1vh auto 0 -2vh;
        position: fixed;
        right: 4vw;
        top: 92vh;
      }
    }
    ul {
      margin-top: 2vh;
      li {
        a {
          display: block;
          text-align: center;
          padding: .5rem 0;
          background-color: rgba(255,255,255,0.1);
          &:hover {
            background-color: rgba(255,255,255,0.2);
            border-bottom: none;
          }
        }
      }
    }
    .wrap {
      width: 100vw;
      height: 98vh;
    }
    .opened {
      height: 98vh;
      animation-name: opening;
      animation-duration: .2s;
    }
    .closed {
      height: 0;
      animation-name: closing;
      animation-duration: .2s;
      border-top: 1px solid rgba(255,255,255,0.5);
    }
  }
  @keyframes opening {
    from { height: 2vh; }
    to { height: 98vh; }
  }
  @keyframes closing {
    from { height: 98vh; }
    to { height: 2vh; }
  }
</style>
