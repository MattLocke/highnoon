<template lang="pug">
  .mobile-menu.is-hidden-desktop(@click="toggle")
    .wrap(:class="{opened: showMenu, closed: !showMenu}")
      .main-mobile-menu
        ul
          li(v-for="menuItem in menuItems")
            router-link.ow-font(:to="menuItem.where") {{ menuItem.name }}
        .box
          p This site is currently in development for version 2.0  If you have any questions or issues, please
          a(href="https://discord.gg/H5bNcYD")  find us on discord.
        hr
        ul
          li
            a.ow-font(@click="logOut()") Log Out
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'

import menuService from '@/services/menu'

export default {
  name: 'MobileMenu',
  data () {
    return {
      showMenu: false
    }
  },
  computed: {
    menuItems () {
      return menuService.getMainMenuItems()
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
  position: absolute;
  bottom: 0;
  width: 100vw;
  background-color: rgba(0,0,0,0.8);
  ul {
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
  }
  .opened {
    height: 40vh;
  }
  .closed {
    height: 2vh;
    border-top: 1px solid rgba(255,255,255,0.5);
  }
}
</style>
