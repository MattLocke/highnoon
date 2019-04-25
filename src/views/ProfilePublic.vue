<template lang="pug">
  .public-profile
    .container
      section
        h1
          img(src="images/premier.png" v-if="profile.isPremier" v-tooltip="'This user is a Premier user!'")
          img(src="images/ultimate.png" v-if="profile.isUltimate" v-tooltip="'This user is an Ultimate user!'")
          | {{ profile.displayName }}'s Public Profile
        article.media
          figure.media-left
            .image.is-128x128
              img(:src="profileImage" v-if="profileImage")
              img(src="images/empty-profile.png" v-else)
          .media-content
            .columns
              .column.is-narrow(v-if="profile.battleNet")
                b-field(label="Battle.Net")
                  span {{ profile.battleNet }}
              .column.is-narrow(v-if="profile.discord")
                b-field(label="Battle.Net")
                  span {{ profile.discord }}
              .column.is-narrow(v-if="profile.reddit")
                b-field(label="Reddit")
                  span {{ profile.reddit }}
              .column.is-narrow(v-if="profile.psn")
                b-field(label="PSN")
                  span {{ profile.psn }}
              .column.is-narrow(v-if="profile.xbox")
                b-field(label="XBOX Live")
                  span {{ profile.xbox }}
      section
        h2 Player Stats
        p Player stats are coming soon!
      section
        h2 Trophies
        p Trophies are coming soon!
</template>

<script>
// import firebase from 'firebase/app'

import ImageService from '@/services/image'
import userService from '@/services/user'

export default {
  name: 'ProfilePublic',
  data () {
    return {
      userId: '',
      profile: {},
      profileImage: ''
    }
  },
  mounted () {
    this.userId = this.$route.params.userId
    userService.getProfile(this.userId)
      .then((user) => {
        this.profile = user
      })
      .then(() => ImageService.getImage('users', `${this.userId}.jpg`))
      .then((image) => {
        this.profileImage = image
      })
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

<style lang="scss">
  .public-profile {
    h1 {
      img {
        height: 1.5rem;
        width: auto;
        padding-right: .5rem;
      }
    }
  }
</style>
