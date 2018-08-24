<template lang="pug">
  .logout
    #errorMessage(v-if="errorMessage") {{ errorMessage }}
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'Logout',
  data () {
    return {
      errorMessage: null
    }
  },
  mounted: function () {
    var _this = this
    firebase.auth().signOut().then(function () {
      _this.$store.dispatch('logOut')
      _this.$router.push({path: '/Login'})
    }).catch(function (error) {
      // An error happened.
      _this.errorMessage = error
    })
  }
}
</script>
