<template lang="pug">
  .navbar.is-fixed-top(role="navigation")
    .navbar-brand
      router-link.navbar-item.ow-font(to="/home")
        img.logo(src="images/high_noon_white.svg" width="36" height="36")
        |  HIGHNOON
        span.orange .GG
      a.navbar-burger.burger(role="button" :class="{'is-active': isActive}" @click="isActive=!isActive")
        span
        span
        span
    #primaryNav.navbar-menu(:class="{'is-active': isActive}" @click="isActive=!isActive")
      .navbar-end
        router-link.navbar-item(
          v-for="(menuItem, index) in menuItems"
          :key="index"
          :to="menuItem.where"
          v-if="canSee(menuItem)") {{ menuItem.name }}
        router-link.navbar-item(
          v-if="currentUser"
          to="/profile") {{ profile.displayName }}
        router-link.navbar-item(
          v-else to="/login") Log In
        a.navbar-item(
          href="https://discord.gg/wTR5AEu"
        ) Discord
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'
import { get } from 'lodash'

import menuService from '@/services/menu'

import supportMessage from '@/components/SupportMessage'

export default {
  components: {
    supportMessage
  },
  data () {
    return {
      isActive: false
    }
  },
  computed: {
    menuItems () {
      return menuService.getMainMenuItems()
    },
    isVerified () {
      return get(this.$store.state.fireUserData, 'emailVerified', false)
    },
    currentUser () {
      return this.$store.getters.isLoggedIn
    },
    profile () {
      return this.$store.getters.getUserData
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
    }
  }
}
</script>

<style lang="scss">
#app .navbar {
  background-color: #090c1c;
  #primaryNav {
    background-color: #090c1c;
  }
  .navbar-item {
    color: #fff;
    &:hover {
      color: #fff;
      background-color: #10152f;
      border-bottom: 1px solid #f99e1a;
    }
  }
  .router-link-active {
    border-bottom: 1px solid #f99e1a;
  }
  .navbar-brand .navbar-item {
    font-size: 24px;
    border-bottom: none;
  }
}
</style>
