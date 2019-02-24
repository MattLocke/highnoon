<template lang="pug">
  .edit-league-schedule
    .columns.is-multiline
      .column.is-one-fifth(v-for="(s, week) in localSchedule")
        label.label Week {{ week }}
        div(v-for="matchup in s")
          b-select(placeholder="Filter By Team" v-model="matchup.away" :disabled="matchup.away.result")
            option(:value="bye") Bye
            option(v-for="team in cleanLeagueUsers" :value="team") {{ team.teamName }}
          span vs
          b-select(placeholder="Filter By Team" v-model="matchup.home" :disabled="matchup.away.result")
            option(:value="bye") Bye
            option(v-for="team in cleanLeagueUsers" :value="team") {{ team.teamName }}
          hr
    hr
    button.button.is-primary(@click="saveSchedule") Save Schedule
</template>

<script>
import { forEach } from 'lodash'
import LeagueService from '@/services/league'

export default {
  name: 'EditLeagueSchedule',
  props: {
    schedule: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      bye: {
        displayName: 'Bye',
        teamName: 'Bye',
        userId: 'Bye'
      },
      localSchedule: {}
    }
  },
  computed: {
    leagueId () {
      return this.$route.params.leagueId
    },
    cleanLeagueUsers () {
      const clean = {}
      forEach(this.leagueUsers, (user, theUserId) => {
        const { displayName, teamName, userId } = user
        clean[theUserId] = {
          displayName,
          teamName,
          userId
        }
      })
      return clean
    },
    leagueUsers () {
      return this.$store.getters.getLeagueUsers
    }
  },
  watch: {
    schedule: {
      immediate: true,
      handler (val) {
        this.localSchedule = { ...val }
      }
    }
  },
  methods: {
    saveSchedule () {
      this.$store.dispatch('setLoading', true)
      LeagueService.setSchedule(this.localSchedule, this.leagueId)
        .then(() => {
          this.$toast.open({
            message: 'Successfully created new schedule!',
            type: 'is-success',
            position: 'is-bottom'
          })
          window.location.reload()
        })
        .catch(error => {
          this.$toast.open({
            message: error,
            type: 'is-danger',
            position: 'is-bottom'
          })
        })
        .finally(() => {
          this.$store.dispatch('setLoading', false)
        })
    }
  }
}
</script>
