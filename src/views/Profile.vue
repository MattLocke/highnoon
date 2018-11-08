<template lang="pug">
  .profile
    .columns
      left-bar
        .box
          img(:src="profileImage")
      .column
        .container
          h1 Profile for {{ profile.displayName }}
          hr
          //- achievements
          settings
          social
</template>

<script>
import ImageService from '@/services/image'

import Achievements from '@/views/profile/Achievements'
import Settings from '@/views/profile/Settings'
import Social from '@/views/profile/Social'

export default {
  name: 'Profile',
  components: {
    Achievements,
    Settings,
    Social
  },
  data () {
    return {
      profileImage: ''
    }
  },
  computed: {
    profile () {
      return this.$store.getters.getUserData
    }
  },
  watch: {
    profile: {
      immediate: true,
      deep: true,
      handler () {
        if (!this.profile.profileImageUrl) {
          ImageService.getImage('users', `${this.profile.id}.jpg`).then((image) => {
            this.profileImage = image
            // we should set this on the profile as well.
            this.$store.dispatch('saveProfileAvatar', image)
          })
        } else this.profileImage = this.profile.profileImageUrl
      }
    }
  }
}
/*
avatar:"Vq1h1yfQKeeG8RbwLd8ATsK4wgE3.jpg"
backgroundColor:"#174b97"
battleNet:"SouldrinK#1362"
discord:"SouldrinK#9274"
displayName:"SouldrinK"
email:"matt@highlevel.io"
gravatar:"https://www.gravatar.com/avatar/3a21f11c6375e1ff38256f3b16f437b3?s=128"
id:"Vq1h1yfQKeeG8RbwLd8ATsK4wgE3"
isAdmin:true
isEditor:true
lastActive:1535006555
lifetimePoints:0
showChat:true
signature:"SouldrinK - Owner"
teamLogo:"uprising.svg"
*/
</script>
