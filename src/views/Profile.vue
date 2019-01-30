<template lang="pug">
  .profile
    .columns.is-marginless
      left-bar
        section.has-text-centered(v-if="!updatingAvatar")
          img(:src="profileImage")
          hr
          button.button.is-primary(@click="updatingAvatar = true") Change Profile Picture
        section.has-text-centered(v-else)
          picture-input(ref="pictureInput", width="250", height="250", accept="image/jpeg", size=".1", buttonClass="button is-primary", @change="uploadPicture")
          hr
          button.button.is-secondary(@click="updatingAvatar = false") Cancel
      .column
        .container
          h1 Profile for {{ localProfile.displayName }}
          hr
          //- achievements
          section.settings
            h2 Your Settings
            .columns
              .column.is-narrow
                b-field(label="Overwatch Role")
                  b-select(placeholder="Select Role" v-model="localProfile.primaryRole")
                    option Tank
                    option Offense
                    option Support
              .column.is-narrow
                b-field(label="Receive Emails")
                  b-checkbox(v-model="localProfile.getEmails") Yes I'd like emails.

          section.social
            h2 Social Settings
            .columns.is-multiline
              .column.is-narrow
                b-field(label="Battle.net")
                  b-input(v-model="localProfile.battleNet")
              .column.is-narrow
                b-field(label="Discord")
                  b-input(v-model="localProfile.discord")
              .column.is-narrow
                b-field(label="Reddit")
                  b-input(v-model="localProfile.reddit")
              .column.is-narrow
                b-field(label="XBOX Live")
                  b-input(v-model="localProfile.xbox")
              .column.is-narrow
                b-field(label="PSN")
                  b-input(v-model="localProfile.psn")
          section
            b-field(label="Alpha")
              b-checkbox(v-model="localProfile.isAlpha")
          section
            button.button.is-primary(@click="saveProfile") Save Profile
            hr
            a(@click="logOut()") Log Out
          b-tabs(v-model="activeContentTab" v-if="localProfile.isAdmin")
            b-tab-item(label="Upload News Image")
              news-image-uploader
            b-tab-item(label="System Notification")
              section
                b-field(label="System Notification")
                  b-input(v-model="notificationMessage")
                button.button.is-primary(@click="setNotificationMessage") Set Notification
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'
import PictureInput from 'vue-picture-input'

import ImageService from '@/services/image'
import UserService from '@/services/user'

import Achievements from '@/views/profile/Achievements'
import NewsImageUploader from '@/views/news/NewsImageUploader'

export default {
  name: 'Profile',
  components: {
    Achievements,
    NewsImageUploader,
    PictureInput
  },
  data () {
    return {
      activeContentTab: '',
      profileImage: '',
      localProfile: {
        primaryRole: '',
        getEmails: true,
        reddit: '',
        battleNet: '',
        discord: '',
        psn: '',
        xbox: ''
      },
      notificationMessage: '',
      updatingAvatar: false
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
      handler () {
        if (!this.profile.profileImageUrl && this.profile.id) {
          ImageService.getImage('users', `${this.profile.id}.jpg`).then((image) => {
            this.profileImage = image
            // we should set this on the profile as well.
            this.$store.dispatch('saveProfileAvatar', image)
          })
        } else this.profileImage = this.profile.profileImageUrl
        this.localProfile = { ...this.localProfile, ...this.profile }
      }
    }
  },
  methods: {
    uploadPicture () {
      // nada
    },
    logOut () {
      firebase.auth().signOut()
        .then(() => {
          // this.$router.push({ path: '/login' })
          location.reload()
        })
    },
    saveProfile () {
      this.$store.dispatch('setLoading', true)
      if (this.updatingAvatar) {
        ImageService.uploadImage('users', `${this.profile.id}.jpg`, this.$refs.pictureInput.file)
          .then((response) => {
            if (response) {
              this.localProfile.avatar = `${this.profile.id}.jpg`
              UserService.updateProfile(this.localProfile, this.localProfile.id)
                .then(() => {
                  this.$store.dispatch('setLoading', false)
                  this.$toast.open({
                    message: 'Profile successfully updated!',
                    type: 'is-success',
                    position: 'is-bottom'
                  })
                })
            } else {
              this.$store.dispatch('setLoading', false)
              this.$toast.open({
                message: 'Unable to save your profile.  Image upload failed.  Please try again!',
                type: 'is-danger',
                position: 'is-bottom'
              })
            }
          })
      } else {
        UserService.updateProfile(this.localProfile, this.localProfile.id)
          .then(() => {
            this.$store.dispatch('setLoading', false)
            this.$toast.open({
              message: 'Profile successfully updated!',
              type: 'is-success',
              position: 'is-bottom'
            })
          })
      }
    },
    setNotificationMessage () {
      const db = firebase.database()
      db.ref('/notification/system').set({ message: this.notificationMessage })
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
