<template lang="pug">
  #app
    chatbox
    navigation(:userData="profile", :isVerified="isVerified")
    router-view(v-bind:style="{ background: backgroundColor }" :key="$route.fullPath")
    the-footer
</template>

<script>
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import chatbox from '@/components/ChatBox'
import firebase from 'firebase'
import fireUser from '@/services/user'
import fireConfig from '@/services/config'
// import fcm from '@/services/fcm'

export default {
  name: 'app',
  components: {
    'navigation': Navigation,
    'theFooter': Footer,
    chatbox
  },
  data () {
    return {
      profile: {},
      isVerified: 'yep'
    }
  },
  methods: {
    saveData: function (userData, user) {
      var tmp = {}
      tmp.uid = user.uid
      tmp.emailVerified = user.emailVerified

      this.$store.dispatch('logIn', userData)
      this.$store.dispatch('saveFireData', tmp)
      this.$localStorage.set('hnpId', user.uid)
    }
  },
  computed: {
    backgroundColor: function () {
      var tmp = ''
      if (this.profile.backgroundColor) tmp = 'linear-gradient(' + this.profile.backgroundColor + ', white)'
      else tmp = 'linear-gradient(#218ffe, white)'
      return tmp
    }
  },
  mounted: function () {
    var _this = this
    // get user info
    // verify user is logged in, set variable accordingly.
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // if (user.emailVerified) _this.isVerified = true
        if (user.emailVerified) _this.isVerified = true
        else _this.isVerified = false
        fireUser.getProfile(user.uid).then(function (userData) {
          _this.profile = userData
          _this.saveData(userData, user)
        })
        fireUser.setLastActive(user.uid)
        // FCM - token stuff
        // fcm.registerWorker(user.uid)
      }
    })

    // get app base config, right now just for owl
    fireConfig.getConfig('owl').then(function (config) {
      _this.$store.dispatch('saveConfig', config)
    })
  }
}
</script>

<style lang="scss">
  @import 'variables.scss';
  @import 'fonts.scss';
  @import 'master.scss';
  .colored {
    background: linear-gradient($owp-ltblue, white);
  }
</style>
