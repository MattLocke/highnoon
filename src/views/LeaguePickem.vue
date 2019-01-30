<template lang="pug">
  .league-pickem
    .columns
      left-bar
        h2 Your Picks
        match-listing(v-for="match in currentWeeksMatches" :match="match" :key="match.id")
        .left-bar-item Ability to save these coming soon!
      .column
        h1 {{ league.leagueName }}
        b-tabs(v-model="activeContentTab")
          b-tab-item(label="League Message")
            section.league-message
              h2 League Message
                button.button.is-secondary.is-small.is-pulled-right(@click="editingMessage = !editingMessage" v-if="isOwner") {{ editingMessage ? 'cancel' : 'edit' }}
              hr
              .wrap(v-if="editingMessage")
                b-field(label="League Message")
                  b-input(type="textarea" v-model="league.message" rows="10")
                button.button.is-primary(@click="updateLeague") Save Message
                hr
              vue-markdown(v-if="leagueMessage" :source="leagueMessage")
              .wrap(v-else)
                img(src="https://firebasestorage.googleapis.com/v0/b/overwatch-pickem.appspot.com/o/images%2Fleagues%2Fwelcome-to-your-league.jpg?alt=media&token=bbf8225c-6bd0-4b1a-b5e0-d864a3047395")
                p Click on the edit button above to customize your league landing page!  Inform members of the rules you have, the prizes you're giving away - whatever makes sense!
          b-tab-item(label="Trash Talk")
            trash-talk
        pickem-leaderboard
</template>

<script>
import { get, sortBy } from 'lodash'
import vueMarkdown from 'vue-markdown'

import LeagueService from '@/services/league'

import MatchListing from '@/views/pickem/MatchListing'
import PickemLeaderboard from '@/views/leagues/PickemLeaderboard'
import TrashTalk from '@/views/draft/TrashTalk'

export default {
  name: 'LeaguePickem',
  components: {
    MatchListing,
    PickemLeaderboard,
    TrashTalk,
    vueMarkdown
  },
  data () {
    return {
      activeContentTab: null,
      editingMessage: false,
      league: {
        message: '',
        image: ''
      }
    }
  },
  computed: {
    config () {
      return this.$store.getters.getConfig
    },
    currentWeeksTimes () {
      const currentWeekIndex = this.config.currentWeek === 0 ? 0 : this.config.currentWeek - 1
      const currentStage = this.config.currentStage || 1
      const weekTimes = get(this.config, `stage${currentStage}times`, [])
      return weekTimes[currentWeekIndex]
    },
    currentWeeksMatches () {
      if (this.currentWeeksTimes) return sortBy(this.matches.filter(match => match.startDateTS >= this.currentWeeksTimes.starts && match.endDateTS <= this.currentWeeksTimes.ends), 'startDateTS')
      return []
    },
    isOwner () {
      return this.userId === this.league.ownerId
    },
    leagueId () {
      return this.$route.params.leagueId
    },
    leagueMessage () {
      return this.league.message
    },
    matches () {
      return this.$store.getters.getMatches
    },
    userId () {
      return this.$store.getters.getUserId
    }
  },
  watch: {
    leagueId: {
      immediate: true,
      handler (val) {
        if (val) {
          this.$store.dispatch('fetchLeagueUsers', { leagueId: this.leagueId, leagueType: 'pickem' })
          this.getLeague(val)
        }
      }
    }
  },
  mounted () {
    this.$store.dispatch('fetchMatches')
  },
  methods: {
    getLeague (leagueId) {
      this.$store.dispatch('setLoading', true)
      LeagueService.getLeague(leagueId, 'pickem')
        .then((league) => {
          this.league = { ...this.league, ...league }
        })
        .then(() => {
          this.$store.dispatch('setLoading', false)
          this.listenForDraft()
        })
        .catch(() => {
          this.$store.dispatch('setLoading', false)
        })
    },
    updateLeague () {
      this.$store.dispatch('setLoading', true)
      LeagueService.updateLeague(this.league, 'pickem')
        .then(() => {
          this.editingMessage = false
          this.$store.dispatch('setLoading', false)
        })
    }
  }
}
</script>
