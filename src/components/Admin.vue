<template lang="pug">
  .testing
    section.section
      .container
        //- .box
          send-email
        .box
          h1 Admin Section
        .box
          add-notification
          //- move-comps
        .box
          enter-winner
          //- create-team
        .box
          create-match
        .box
          manage-roster
          //- populate-data
        .box
          get-users
          //- enter-winner
          //- remove-duplicates
          //- reset-points
          //- assign-points
          //- update-league-users
          //- expire-leagues
</template>

<script>
import firebase from 'firebase'
import fireUser from '@/services/user'
import createTeam from '@/components/admin/CreateTeam'
import createMatch from '@/components/admin/CreateMatch'
import enterWinner from '@/components/admin/EnterWinner'
import removeDuplicates from '@/components/admin/RemoveDuplicates'
import resetPoints from '@/components/admin/ResetPoints'
import assignPoints from '@/components/admin/AssignPoints'
import updateLeagueUsers from '@/components/admin/UpdateLeagueUsers'
import populateData from '@/components/admin/PopulateData'
import expireLeagues from '@/components/admin/ExpireLeagues'
import moveComps from '@/components/admin/MoveComps'
import getUsers from '@/components/admin/GetAllUsers'
import addNotification from '@/components/admin/AddNotification'
import manageRoster from '@/components/admin/ManageRoster'
import sendEmail from '@/components/admin/SendEmail'

export default {
  name: 'admin',
  components: {
    createTeam,
    createMatch,
    enterWinner,
    removeDuplicates,
    resetPoints,
    assignPoints,
    updateLeagueUsers,
    populateData,
    expireLeagues,
    moveComps,
    getUsers,
    addNotification,
    manageRoster,
    sendEmail
  },
  data () {
    return {
      userData: {},
      user: {},
      currentBoard: 'update'
    }
  },
  methods: {
    activeBoard: function (board) {
      return (this.currentBoard === board)
    }
  },
  mounted: function () {
    var _this = this
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
  .choose-board a {
    display: inline-block;
    padding: .4rem 3rem;
    background-color: $owp-orange;
    color: #fff;
    font-size: 1.3rem;
    &.is-active {
      background-color: $owp-dkblue;
    }
  }
  .blue-box {
    border: 2px solid $owp-dkblue;
    border-radius: 0 4px 4px 4px;
    padding: 1rem;
  }
</style>
