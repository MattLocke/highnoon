<template lang="pug">
  .league-schedule
    section
      h2.has-pointer(@click="showSchedule = !showSchedule") League Schedule
        arrow(:isLeft="true" v-model="showSchedule")
      .wrap(v-if="showSchedule")
        .wrap(v-if="hasSchedule")
          p This is where you can see the week-to-week matchups.  This list is completely randomized, so if you play some people more than once and others not at all, it's just the luck of the draw.
          hr
          .columns.is-multiline
            .column.is-narrow(v-for="(week, index) in schedule")
              leagueScheduleWeek(:week="week" :index="index")
        .wrap(v-else)
          p The schedule will be created when the draft has started.
</template>

<script>
import { isEmpty } from 'lodash'
import LeagueService from '@/services/league'

import LeagueScheduleWeek from '@/views/leagues/LeagueScheduleWeek'

export default {
  name: 'LeagueSchedule',
  components: {
    LeagueScheduleWeek
  },
  data () {
    return {
      schedule: [],
      showSchedule: false
    }
  },
  computed: {
    leagueId () {
      return this.$route.params.leagueId
    },
    hasSchedule () {
      return !isEmpty(this.schedule)
    }
  },
  watch: {
    leagueId: {
      immediate: true,
      handler (val) {
        if (val) {
          this.getSchedule(val)
        }
      }
    }
  },
  methods: {
    getSchedule (leagueId) {
      this.$store.dispatch('setLoading', true)
      LeagueService.getSchedule(leagueId)
        .then((schedule) => {
          this.schedule = schedule
          this.$store.dispatch('setLoading', false)
        })
    }
  }
}
</script>
