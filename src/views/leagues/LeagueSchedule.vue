<template lang="pug">
  .league-schedule
    section
      collapsible(title-text="Full Schedule")
        .wrap(v-if="hasSchedule")
          p This is where you can see the week-to-week matchups.
          hr
          button.button.is-primary(v-if="isOwner" @click="editScheduleMode = !editScheduleMode") {{ editScheduleMode ? 'Cancel' : 'Edit Schedule' }}
          .columns.is-multiline(v-if="!editScheduleMode")
            .column.is-narrow(v-for="(week, index) in schedule")
              leagueScheduleWeek(:week="week" :index="index")
          edit-league-schedule(v-else :schedule="schedule")
        .wrap(v-else)
          p The schedule will be created when the draft has started.
</template>

<script>
import { isEmpty } from 'lodash'
import LeagueService from '@/services/league'

import EditLeagueSchedule from '@/views/leagues/EditLeagueSchedule'
import LeagueScheduleWeek from '@/views/leagues/LeagueScheduleWeek'

export default {
  name: 'LeagueSchedule',
  components: {
    EditLeagueSchedule,
    LeagueScheduleWeek
  },
  props: {
    isOwner: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      editScheduleMode: false,
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
