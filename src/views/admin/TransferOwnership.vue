<template lang="pug">
  section.transfer-ownership
    collapsible(title-text="Transfer Ownership" :start-collapsed="true")
      b-field
        b-select(placeholder="Choose New Owner" v-model="newOwner")
          option(v-for="user in leagueUsers" :value="user") {{ user.displayName }}
      b-field
        button.button.is-primary.is-small(@click="transferOwnership" v-if="canTransfer") Transfer Ownership
        button.button.is-primary.is-small(disabled v-else) Transfer Ownership
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
      newOwner: {}
    }
  },
  computed: {
    canTransfer () {
      return !isEmpty(this.newOwner)
    },
    leagueId () {
      return this.$route.params.leagueId
    },
    leagueUsers () {
      return this.$store.getters.getLeagueUsers || []
    }
  },
  methods: {
    transferOwnership () {
      this.$store.dispatch('setLoading', true)
      LeagueService.changeOwner(this.leagueId, this.leagueType, this.newOwner.userId)
        .then(() => {
          window.location.reload()
        })
    }
  }
}
</script>
