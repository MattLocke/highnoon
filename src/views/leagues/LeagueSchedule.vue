<template lang="pug">
  .league-schedule
    section
      h2 League Schedule
        arrow(:isLeft="true" v-model="showSchedule")
      .wrap(v-if="showSchedule")
        button.button.is-primary(@click="generateSchedule") Generate Schedule
        hr
        .wrap(v-if="schedule.length")
          div(v-for="(week, index) in schedule")
            leagueScheduleWeek(:week="week" :index="index")
</template>

<script>
import { shuffle } from 'lodash'

import LeagueService from '@/services/league'

import LeagueScheduleWeek from '@/views/leagues/LeagueScheduleWeek'

export default {
  name: 'LeagueSchedule',
  components: {
    LeagueScheduleWeek
  },
  data () {
    return {
      leagueUsers: [],
      schedule: [],
      showSchedule: false,
      totalWeeks: 20
    }
  },
  computed: {
    leagueId () {
      return this.$route.params.leagueId
    },
    config () {
      return this.$store.getters.getConfig
    }
  },
  watch: {
    leagueId: {
      immediate: true,
      handler (val) {
        if (val) {
          this.getLeagueUsers(val)
        }
      }
    }
  },
  methods: {
    getLeagueUsers (leagueId) {
      this.$store.dispatch('setLoading', true)
      LeagueService.getLeagueUsers(leagueId)
        .then((users) => {
          this.leagueUsers = Object.values(users)
          this.$store.dispatch('setLoading', false)
        })
    },
    generateSchedule () {
      // const currentWeek = this.config.currentWeek
      const half = this.leagueUsers.length / 2
      const weeks = []
      for (let i = 0; i < this.totalWeeks; i++) {
        let homeTeams = [...this.leagueUsers]
        let offset = i % half
        let awayTeams = homeTeams.splice(offset, half)
        let week = []
        homeTeams = shuffle(homeTeams)

        for (let j = 0; j < half; j++) {
          let matchup = {
            home: homeTeams[j],
            away: awayTeams[j]
          }
          week.push(matchup)
        }

        weeks.push(week)
      }
      this.schedule = weeks
    }
  }
}
</script>
