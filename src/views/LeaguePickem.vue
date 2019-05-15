<template lang="pug">
  .league-pickem
    .columns
      left-bar
        convert-to-featured(:league="league" v-if="userData.isAdmin")
        transfer-ownership(leagueType="pickem" v-if="userData.isAdmin")
        remove-user(v-if="isOwner || userData.isAdmin" leagueType="pickem")
        your-leagues(:userId="userId")
        section(v-if="isInLeague")
          h2 Team Name
          editable-field(:initial-value="teamName" @updated-value="setTeamName")
        section(v-if="isOwner")
          collapsible(title-text="League Password" :start-collapsed="true")
            b-field(label="Password")
              b-input(v-model="league.password")
            b-field
              button.button.is-primary(@click="updateLeague") Update Password
            p To remove the password, simply update with no password in the field.
        section(v-if="liveConfig.canPick")
          collapsible(title-text="Your Picks")
            b-checkbox(v-model="showPickRates") Show Pick Rates
            hr
            match-listing(v-for="match in currentWeeksMatches" :showPickRates="showPickRates" :match="match" :key="match.id" :leagueId="leagueId" :pickStats="pickStats")
        section(v-else)
          h2 Your Picks
          span {{ liveConfig.featureDownMessage }}
        section(v-if="leagueUsers && leagueUsers.length")
          collapsible(:title-text="`League Users (${leagueUsers.length})`" :start-collapsed="true")
            .left-bar-item(v-for="user in leagueUsers") {{ user.displayName }}
        section(v-if="isOwner")
          collapsible(title-text="Delete League" :start-collapsed="true")
            confirm-button(button-text="Delete League" confirm-text="Are You Sure?" extra-text="This action can not be undone, and all users will lose their points and picks associated with this league." @confirm-it="deleteLeague")
        section(v-if="isInLeague")
          button.button.is-secondary.is-small(@click="copyLink") Copy Share Link
      .column
        h1 {{ league.leagueName }}
        b-tabs(v-model="activeContentTab" type="is-boxed")
          b-tab-item(label="League Message")
            section.league-message
              h2 League Message
                button.button.is-secondary.is-small.is-pulled-right(@click="editingMessage = !editingMessage" v-if="isOwner") {{ editingMessage ? 'cancel' : 'edit' }}
              hr
              .wrap(v-if="editingMessage")
                b-field(label="League Title")
                  b-input(type="text" v-model="league.leagueName")
                b-field(label="League Message")
                  b-input(type="textarea" v-model="league.message" rows="10")
                button.button.is-primary(@click="updateLeague") Save Message
                hr
              vue-markdown(v-if="leagueMessage" :source="leagueMessage" :html="false")
              .wrap(v-else)
                img(src="https://firebasestorage.googleapis.com/v0/b/overwatch-pickem.appspot.com/o/images%2Fleagues%2Fwelcome-to-your-league.jpg?alt=media&token=bbf8225c-6bd0-4b1a-b5e0-d864a3047395")
                p Click on the edit button above to customize your league landing page!  Inform members of the rules you have, the prizes you're giving away - whatever makes sense!
          b-tab-item(label="Leaderboard")
            h2 League Leaderboard
            p The picks simply show 1 point per correct guess.  I'll show % / etc coming soon.  Just getting all of these in place before we improve them!
            hr
            b-table(
              :data="sortedScoreboard"
              :paginated="true"
              :per-page="30"
              )
              template(slot-scope="props")
                b-table-column(label="Pos" field="pos" width="20" sortable)
                  span {{ props.row.pos }}
                b-table-column(label="User" field="displayName" width="180" sortable)
                  router-link(:to="`/user/${props.row.userId}`" v-if="props.row.displayName") {{ props.row.displayName }}
                  span(v-else) Vacated
                b-table-column(label="Team Name" field="teamName" sortable)
                  span {{ props.row.teamName || 'vacated' }}
                b-table-column(label="Score" width="30" field="points" sortable)
                  span {{ props.row.points }}
          b-tab-item(label="Previous Picks")
            .columns
              .column.is-one-third-desktop
              .column.is-one-third-desktop
                match-listing(v-for="match in previousWeeksMatches" :match="match" :key="match.id" :leagueId="leagueId" :pickStats="pickStats")
              .column.is-one-third-desktop
          b-tab-item(label="Trash Talk" v-if="isInLeague")
            trash-talk
        section(v-if="canJoinLeague")
          b-field(label="password" v-if="league.password")
            b-input(type="password" v-model="localPassword")
          button.button.is-primary(@click="joinLeague") Join League
        section(v-if="isInLeague && !isOwner")
          confirm-button(buttonText="Leave League" confirmText="Are You Sure?" @confirm-it="leaveLeague")
</template>

<script>
import { get, forEach, orderBy, sortBy } from 'lodash'
import vueMarkdown from 'vue-markdown'

import LeagueService from '@/services/league'

import ConvertToFeatured from '@/views/admin/ConvertToFeatured'
import MatchListing from '@/views/pickem/MatchListing'
import PickemLeaderboard from '@/views/leagues/PickemLeaderboard'
import RemoveUser from '@/views/leagues/RemoveUser'
import TransferOwnership from '@/views/admin/TransferOwnership'
import TrashTalk from '@/views/draft/TrashTalk'
import YourLeagues from '@/views/leagues/YourLeagues'

export default {
  name: 'LeaguePickem',
  components: {
    ConvertToFeatured,
    MatchListing,
    PickemLeaderboard,
    RemoveUser,
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
      },
      localPassword: '',
      showPickRates: false
    }
  },
  computed: {
    canJoinLeague () {
      // Needs to check league type, number of users, league status, etc.
      if (this.league.leagueType !== 'pickem') return false
      if (this.league.isLocked) return false
      if (this.isInLeague) return false
      if (this.userData.isPremier || this.userData.isAdmin) return true
      if (this.userLeagues && this.userLeagues.length > 7) return false
      return true
    },
    config () {
      return this.$store.getters.getConfig
    },
    currentWeeksTimes () {
      const currentStage = this.config.currentStage || 1
      const currentWeekIndex = this.config.currentWeek === 0 ? 0 : Math.round(this.config.currentWeek - ((currentStage - 1) * 5) - 1)
      const weekTimes = get(this.config, `stage${currentStage}times`, [])
      console.log(`Current week index: ${currentWeekIndex}`)
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
    liveConfig () {
      return this.$store.getters.getLiveConfig
    },
    matches () {
      return this.$store.getters.getMatches
    },
    pickStats () {
      return this.$store.getters.getPickStats
    },
    previousWeeksMatches () {
      if (this.currentWeeksTimes) return sortBy(this.matches.filter(match => match.startDateTS < this.currentWeeksTimes.starts), 'startDateTS')
      return []
    },
    sortedScoreboard () {
      const theUsers = this.leagueUsers
      const sorted = orderBy(theUsers, ['points'], ['desc'])
      const filtered = sorted.filter(s => s.points > 0)
      let i = 1
      const indexed = forEach(filtered, s => {
        s.pos = i
        i++
      })
      return indexed
    },
    teamName () {
      return this.leagueUsers.find(user => user.userId === this.userData.id) ? this.leagueUsers.find(user => user.userId === this.userData.id).teamName : ''
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
    copyLink () {
      this.$copyText(`https://highnoon.gg/#/LeaguePickem/${this.leagueId}`)
        .then(() => {
          this.$toast.open({
            message: 'Successfully copied the link!',
            type: 'is-success',
            position: 'is-bottom'
          })
        })
    },
    deleteLeague () {
      LeagueService.deleteLeague(this.leagueId, 'pickem')
        .then(() => {
          this.$router.push({ path: `/leagues` })
        })
        .catch((error) => {
          console.table(error)
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
      LeagueService.joinLeague(this.userData, this.league, 'pickem')
        .then(() => {
          this.$store.dispatch('setLoading', false)
          location.reload()
        })
    },
    leaveLeague () {
      this.$store.dispatch('setLoading', true)
      LeagueService.leaveLeague(this.userId, this.leagueId, 'pickem')
        .then(() => {
          this.$store.dispatch('setLoading', false)
          location.reload()
        })
    },
    setTeamName (newTeamName) {
      const leagueUser = this.leagueUsers.find(user => user.userId === this.userData.id)
      const updatedLeagueUser = {
        [leagueUser.userId]: {
          ...leagueUser,
          teamName: newTeamName
        }
      }
      LeagueService.updateDraftTeamUser(updatedLeagueUser, this.leagueId, 'pickem')
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
