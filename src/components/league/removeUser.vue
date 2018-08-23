<template lang="pug">
  .remove-user
    h3.overwatch-font Remove User
    .remove-wrapper(v-if="validUsers.length")
      .field
        .control
          select.select.is-medium.is-fullwidth(v-model="userId")
            option(v-for="user in validUsers", v-bind:value="user.userId") {{ user.userDisplayName }}
      button.button.positive-button(v-if="isSure" v-on:click="removeUser()") Click To Confirm!
      button.button.negative-button(v-else v-on:click="seeIfSure()") Remove User
    .no-users(v-else)
      p You are the only one in this league.  You can't remove yourself!
</template>

<script>
  import fireLeague from '@/services/league'

  export default {
    props: [
      'leagueId', 'users', 'ownerId'
    ],
    components: {
      'confirm': confirm
    },
    data () {
      return {
        isSure: false,
        userId: ''
      }
    },
    computed: {
      validUsers: function () {
        var _this = this
        var returnUsers = []
        if (this.users) {
          this.users.forEach(function (user) {
            if (user.userId !== _this.ownerId) returnUsers.push(user)
          })
        }
        return returnUsers
      }
    },
    methods: {
      seeIfSure: function () {
        this.isSure = true
      },
      removeUser: function () {
        var isLeaver = false
        fireLeague.leaveLeague(this.leagueId, this.userId, isLeaver)
      }
    }
  }
</script>