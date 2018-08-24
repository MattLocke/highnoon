<template lang="pug">
  .get-users
    h2 Get All Users
    button.button.positive-button(v-bind:class="{'is-loading': isLoading}" v-on:click="getUsers()") Get Users
    table.table
      tr(v-for="user in users")
        td {{ user.email }}
</template>

<script>
import fireUser from '@/services/user'

export default {
  name: 'get-users',
  data () {
    return {
      isLoading: false,
      users: []
    }
  },
  methods: {
    getUsers: function () {
      var _this = this
      fireUser.getAllUsers().then(function (users) {
        _this.users = users
      })
    }
  }
}
</script>
