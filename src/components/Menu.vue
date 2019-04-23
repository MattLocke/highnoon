<template lang="pug">
  .navbar.is-fixed-top(role="navigation")
    .navbar-brand
      router-link.navbar-item.ow-font(to="/home")
        img.logo(src="images/high_noon_white.svg" width="36" height="36")
        |  HIGHNOON
        span.orange .GG
          span.white  |
            span.orange  BETA
      a.navbar-burger.burger(role="button" :class="{'is-active': isActive}" @click="isActive=!isActive")
        span
        span
        span
    #primaryNav.navbar-menu(:class="{'is-active': isActive}" @click="isActive=!isActive")
      .navbar-end
        router-link.navbar-item(
          v-if="currentUser"
          to="/profile")
          img(src="images/premier.png" v-if="profile.isPremier && !profile.isUltimate" v-tooltip="'You are a premier member!'" width="24" height="24")
          img(src="images/ultimate.png" v-if="profile.isUltimate" v-tooltip="'You are an ultimate member!'" width="24" height="24")
          span {{ profile.displayName }}
        router-link.navbar-item(
          v-else to="/login") Log In
        router-link.navbar-item(
          v-for="(menuItem, index) in menuItems"
          :key="index"
          :to="menuItem.where"
          v-if="canSee(menuItem)") {{ menuItem.name }}
        a.navbar-item(href="https://datastudio.google.com/u/0/reporting/13M8W4CCiws4PeZSBswdY3y_iC4dgNFjV/page/Mmei" target="_blank" v-if="profile.isPremier") Premier
        router-link.navbar-item(to="/stats") Stats
        .navbar-item.has-dropdown.is-hoverable(:class="{'is-active': isActive}")
          a.navbar-link Other
          .navbar-dropdown
            a.navbar-item(href="https://highnoon.gg/#/article/Na1lrkeu2s2Pwi8wbQrp") How To Standard
            a.navbar-item(href="https://highnoon.gg/#/article/DUtOLV2iYsTplEgvH3fv") How To Unlimited
            a.navbar-item(href="https://highnoon.gg/#/article/Jx3Z8ZbpWlAon6zx9Osd") How To Pickem
            a.navbar-item(href="https://discord.gg/wTR5AEu" target="_blank") Discord
            a.navbar-item(href="https://www.reddit.com/r/HighNoonPickem/" target="_blank") Reddit
            a.navbar-item(href="https://www.patreon.com/highnoongg" target="_blank") Patreon
            a.navbar-item(href="https://paypal.me/mattlocke/5" target="_blank") Paypal
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
      if (this.profile.isAdmin) return true
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
    &.has-dropdown {
      .navbar-dropdown {
        display: none;
      }
      &.is-active {
        .navbar-dropdown {
          display: block;
        }
      }
    }
  }
  .router-link-active {
    border-bottom: 1px solid #f99e1a;
    background-color: rgba(255,255,255,0.1);
  }
  .navbar-brand .navbar-item {
    font-size: 24px;
    border-bottom: none;
  }
}
</style>
