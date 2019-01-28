<template lang="pug">
  .leagues
    .columns.is-marginless
      left-bar
        your-leagues(:userId="userId")
      .column
</template>

<script>
import LeagueService from '@/services/league'

import YourLeagues from '@/views/leagues/YourLeagues'

export default {
  name: 'UnlimitedLeague',
  components: {
    YourLeagues
  },
  data () {
    return {
    }
  },
  computed: {
    userId () {
      return this.$store.getters.getUserId
    }
  },
  methods: {
    copyLink () {
      this.$copyText(`https://highnoon.gg/#/leagues/${this.leagueId}`)
        .then(() => {
          this.$toast.open({
            message: 'Successfully copied the link!',
            type: 'is-success',
            position: 'is-bottom'
          })
        })
    },
    deleteLeague () {
      LeagueService.deleteLeague(this.leagueId)
        .then(() => {
          this.$router.push({ path: `/leagues` })
        })
        .catch(() => {
          this.$toast.open({
            message: 'There was an issue deleting your league.',
            type: 'is-danger',
            position: 'is-bottom'
          })
        })
    },
    getLeague (leagueId) {
      this.$store.dispatch('setLoading', true)
      LeagueService.getLeague(leagueId)
        .then((league) => {
          this.league = { ...this.league, ...league }
        })
        .then(() => {
          this.$store.dispatch('setLoading', false)
          this.listenForDraft()
        })
        .catch(() => {
          this.$store.dispatch('setLoading', false)
          this.$toast.open({
            message: 'Failure to find that link',
            type: 'is-danger',
            position: 'is-bottom'
          })
        })
    },
    joinLeague () {
      if (this.league.password) {
        if (this.localPassword !== this.league.password) {
          this.$toast.open({
            message: 'Invalid league password',
            type: 'is-danger',
            position: 'is-bottom'
          })
          return
        }
      }
      this.$store.dispatch('setLoading', true)
      LeagueService.joinLeague(this.userData, this.league)
        .then(() => {
          this.$store.dispatch('setLoading', false)
          location.reload()
        })
    },
    leaveLeague () {
      this.$store.dispatch('setLoading', true)
      LeagueService.leaveLeague(this.userId, this.leagueId)
        .then(() => {
          this.$store.dispatch('setLoading', false)
          location.reload()
        })
    },
    updateLeague () {
      this.$store.dispatch('setLoading', true)
      LeagueService.updateLeague(this.league)
        .then(() => {
          this.editingMessage = false
          this.$store.dispatch('setLoading', false)
        })
    }
  }
}
</script>

<style lang="scss">
  .team-owner {
    font-size: .8rem;
    line-height: .6rem;
  }
</style>
