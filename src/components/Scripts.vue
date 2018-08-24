<template lang="pug">
  .scripts
    section.section
      .container
        .box
          pick-percent(v-if="script == 'PickPercent'")
          router-test(v-if="script == 'RouterTest'")
          match-check(v-if="script == 'MatchCheck'")
          user-picks(v-if="script == 'UserPicks'")
</template>

<script>
import firebase from 'firebase'
import fireUser from '@/services/user'
import pickPercent from '@/components/scripts/PickPercentage'
import routerTest from '@/components/scripts/RouterTest'
import matchCheck from '@/components/scripts/MatchCheck'
import userPicks from '@/components/scripts/UserPicks'

export default {
  name: 'scripts',
  components: {
    pickPercent,
    routerTest,
    matchCheck,
    userPicks
  },
  data () {
    return {
      userData: {},
      user: {},
      script: ''
    }
  },
  methods: {
  },
  mounted: function () {
    var _this = this
    this.script = this.$route.params.scriptName
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        _this.user = user
        fireUser.getProfile(user.uid).then(function (userData) {
          _this.userData = userData
          if (!userData.isAdmin) _this.$router.push({path: '/'})
        })
      } else {
        _this.$router.push({path: '/'})
      }
    })
  }
}
</script>

<style lang="scss">
  @import '../variables.scss';
</style>
