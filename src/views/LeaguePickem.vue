<template lang="pug">
  .league-pickem
    .columns
      left-bar
        convert-to-featured(:league="league" v-if="userData.isAdmin")
        transfer-ownership(leagueType="pickem" v-if="userData.isAdmin")
        your-leagues(:userId="userId")
        section
          collapsible(title-text="Your Picks")
            match-listing(v-for="match in currentWeeksMatches" :match="match" :key="match.id" :leagueId="leagueId")
        section(v-if="leagueUsers && leagueUsers.length")
          collapsible(title-text="League Users" :start-collapsed="true")
            .left-bar-item(v-for="user in leagueUsers") {{ user.displayName }}
        section(v-if="isOwner")
          collapsible(title-text="Delete League" :start-collapsed="true")
            confirm-button(button-text="Delete League" confirm-text="Are You Sure?" extra-text="This action can not be undone, and all users will lose their points and picks associated with this league." @confirm-it="deleteLeague")
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
          b-tab-item(label="Trash Talk" v-if="isInLeague")
            trash-talk
          b-tab-item(label="Pick Stats" v-if="isInLeague")
            p Shortly after launch I will begin populating this with some statistics, as well as information that can help you with your picks!
        pickem-leaderboard
</template>

<script>
import { get, sortBy } from 'lodash'
import vueMarkdown from 'vue-markdown'

import LeagueService from '@/services/league'

import ConvertToFeatured from '@/views/admin/ConvertToFeatured'
import MatchListing from '@/views/pickem/MatchListing'
import PickemLeaderboard from '@/views/leagues/PickemLeaderboard'
import TransferOwnership from '@/views/admin/TransferOwnership'
import TrashTalk from '@/views/draft/TrashTalk'
import YourLeagues from '@/views/leagues/YourLeagues'

export default {
  name: 'LeaguePickem',
  components: {
    ConvertToFeatured,
    MatchListing,
    PickemLeaderboard,
    TransferOwnership,
    TrashTalk,
    vueMarkdown,
    YourLeagues
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
    isInLeague () {
      return this.userLeagues.some(league => league.leagueId === this.leagueId)
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
    leagueUsers () {
      return this.$store.getters.getLeagueUsers || []
    },
    matches () {
      return this.$store.getters.getMatches
    },
    userData () {
      return this.$store.getters.getUserData
    },
    userId () {
      return this.$store.getters.getUserId
    },
    userLeagues () {
      return this.$store.getters.getUserLeagues
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
    this.$store.dispatch('fetchPicks')
  },
  methods: {
    deleteLeague () {
      LeagueService.deleteLeague(this.leagueId, 'pickem')
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
