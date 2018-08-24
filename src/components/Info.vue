<template lang="pug">
  .info
    section.section
      .container
        .box
          h1 User Info
          ul
            li Email: {{ profile.email }}
            li Email Verified?: {{ profile.emailVerified }}
            li User Id: {{ profile.uid }}
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'info',
  data () {
    return {
      profile: {}
    }
  },
  mounted: function () {
    var _this = this
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        _this.profile = user
      }
    })
  }
}
</script>
