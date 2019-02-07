<template lang="pug">
  section.transfer-ownership(v-if="leagueUsers.length > 1")
    collapsible(title-text="Remove User" :start-collapsed="true")
      b-field
        b-select(placeholder="Choose User" v-model="userToRemove")
          option(v-for="user in leagueUsers" :value="user" v-if="user.userId !== userData.id") {{ user.displayName }}
      b-field
        button.button.is-primary.is-small(@click="removeUser" v-if="canRemove") Remove User
        button.button.is-primary.is-small(disabled v-else) Remove User
</template>

<script>
import { isEmpty } from 'lodash'

import LeagueService from '@/services/league'

export default {
  name: 'TransferOwnership',
  props: {
    leagueType: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      userToRemove: {}
    }
  },
  computed: {
    canRemove () {
      return !isEmpty(this.userToRemove)
    },
    leagueId () {
      return this.$route.params.leagueId
    },
    leagueUsers () {
      return this.$store.getters.getLeagueUsers || []
    },
    userData () {
      return this.$store.getters.getUserData
    }
  },
  methods: {
    removeUser () {
      this.$store.dispatch('setLoading', true)
      LeagueService.removeUser(this.leagueId, this.leagueType, this.userToRemove.userId)
        .then(() => {
          window.location.reload()
        })
    }
  }
}
</script>
