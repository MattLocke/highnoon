<template lang="pug">
  .mobile-menu.is-hidden-tablet
    .wrap(:class="{opened: showMenu, closed: !showMenu}" @click="toggle")
      .main-mobile-menu(v-if="showMenu")
        ul
          li(v-for="menuItem in menuItems")
            h2
              router-link.ow-font(:to="menuItem.where") {{ menuItem.name }}
        support-message
        hr
        ul
          li
            a.ow-font(@click="logOut()") Log Out
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
  .mobile-menu {
    position: fixed;
    bottom: 0;
    width: 100vw;
    background-color: rgba(0,0,0,0.95);
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
      height: 2vh;
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
