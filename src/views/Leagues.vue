<template lang="pug">
  .leagues
    .columns.is-marginless
      left-bar
        section
          h2 Fantasy Leagues
          .left-bar-item(v-if="!fantasyLeagues.length") You currently have no Fantasy leagues.
          .left-bar-item.has-pointer(:class="{'active-item': $route.params.leagueId == league.leagueId}" v-for="league in fantasyLeagues" :key="league.leagueId" @click="setLeague(league.leagueId)") {{ league.leagueName }}
          hr
          router-link.button.is-primary(to="/createLeague" v-if="userData.isAdmin || userData.isAlpha") Create League
        section(v-if="league.leagueType == 'standard' && league.status != 'complete'")
          h2.has-pointer(@click="showDraftPreference = !showDraftPreference") Draft Preference List
            arrow(:isLeft="true" v-model="showDraftPreference")
          .wrap(v-if="showDraftPreference")
            p You can use this list to auto-draft for you in case you can't make it to the live draft.  Keep in mind, if you use this list, even if you're there for the live draft, this list will take priority!
            hr
            button.button.is-primary(@click="draftPreference") Draft Preference List
        section(v-if="leagueUsers.length")
          h2.has-pointer(@click="showLeagueUsers = !showLeagueUsers") League Users -
            span.orange  {{ leagueUsers.length }}
            arrow(:isLeft="true" v-model="showLeagueUsers")
          span(v-if="showLeagueUsers")
            p(v-for="user in leagueUsers") {{ user.displayName }}
        section(v-if="canLeaveLeague")
          confirm-button(buttonText="Leave League" confirmText="Are You Sure?" @confirm-it="leaveLeague")
        section(v-if="isInLeague")
          h2 Share with others
          button.button.is-primary(@click="copyLink") Copy Share Link
      .column(v-if="league.leagueName")
        section
          p.orange This is alpha-only.  This page will continue to evolve as I work on it.  For now you can invite other alpha members to join your league, do a mock draft, and upon completion of that draft you'll be taken back here.  I'll be adding ways to reset the draft, see the schedule/etc over the next few days.  Stay tuned!  Deadlines are a loomin'!
        h1 {{ league.leagueName }}
        //- .social-icons
          span [TWITTER] [INSTAGRAM] [DISCORD]
        section(v-if="canStartDraft")
          confirm-button(:customClasses="{'is-primary': true,'is-small': true,'is-pulled-right':true}" buttonText="Start Draft" confirmText="Are You Sure?" @confirm-it="startDraft") Start Draft
          h2 Start Draft
        section
          h2 League Message
            button.button.is-primary.is-small.is-pulled-right(@click="editingMessage = !editingMessage" v-if="isOwner") {{ editingMessage ? 'cancel' : 'edit' }}
          hr
          .wrap(v-if="editingMessage")
            b-field(label="League Message")
              b-input(type="textarea" v-model="league.message" rows="10")
            button.button.is-primary(@click="updateLeague") Save Message
            hr
          vue-markdown(v-if="league.message" :source="league.message")
          p(v-else) Click on the edit button above to customize your league landing page!  Inform members of the rules you have, the prizes you're giving away - whatever makes sense!
        section(v-if="canJoinLeague && (userData.isAdmin || userData.isAlpha)")
          b-field(label="password" v-if="league.password")
            b-input(type="password" v-model="localPassword")
          button.button.is-primary(@click="joinLeague") Join League
        section(v-if="isInLeague && !isOwner")
          confirm-button(buttonText="Leave League" confirmText="Are You Sure?" @confirm-it="leaveLeague")
        section(v-if="draftComplete")
          //- Show the "matchups"
        league-schedule
      .column(v-else)
        .container
          h1 Please select a league from the menu.
          p If you have not yet joined a league, you may create one or join a friends!
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'
import { fireInit } from '@/fireLogin'
import { shuffle } from 'lodash'
import vueMarkdown from 'vue-markdown'

import LeagueService from '@/services/league'

import LeagueSchedule from '@/views/leagues/LeagueSchedule'

export default {
  name: 'Leagues',
  components: {
    LeagueSchedule,
    vueMarkdown
  },
  data () {
    return {
      league: {
        message: '',
        image: ''
      },
      leagueUsers: [],
      localPassword: '',
      editingMessage: false,
      draftStatus: '',
      showLeagueUsers: false,
      showDraftPreference: false
    }
  },
  computed: {
    canJoinLeague () {
      // Needs to check league type, number of users, league status, etc.
      if (this.league.leagueType === 'standard' && this.leagueUsers.length > 11) return false
      if (this.league.isLocked) return false
      if (this.userLeagues.length > 4) return false
      if (this.isInLeague) return false
      return true
    },
    canLeaveLeague () {
      return (this.league.status !== 'completed' && !this.isOwner && this.isInLeague)
    },
    canStartDraft () {
      return (this.isOwner && this.unDrafted && this.leagueUsers.length > 1)
    },
    config () {
      return this.$store.getters.getConfig
    },
    draftComplete () {
      return false
    },
    isInLeague () {
      return this.userLeagues.some(league => league.leagueId === this.leagueId)
    },
    isOwner () {
      return this.userId === this.league.ownerId
    },
    totalWeeks () {
      return this.config.totalWeeks
    },
    userId () {
      return this.$store.getters.getUserId
    },
    userData () {
      return this.$store.getters.getUserData
    },
    userLeagues () {
      return this.$store.getters.getUserLeagues
    },
    fantasyLeagues () {
      return this.userLeagues.filter(league => league.leagueType === 'standard')
    },
    leagueId () {
      return this.$route.params.leagueId
    },
    unDrafted () {
      return this.league.status === 'unDrafted'
    },
    players () {
      return this.$store.getters.getPlayers
    }
  },
  watch: {
    players: {
      immediate: true,
      handler (val) {
        if (val && val.length === 0) {
          this.$store.dispatch('setLoading', true)
          this.$store.dispatch('getPlayers')
        } else this.$store.dispatch('setLoading', false)
      }
    },
    userId: {
      immediate: true,
      handler (val) {
        if (val && val.length) this.$store.dispatch('getLeagues', val)
      }
    },
    leagueId: {
      immediate: true,
      handler (val) {
        if (val) this.getLeague(val)
      }
    },
    draftStatus: {
      handler (val) {
        if (val === 'active') {
          this.$router.push({ path: `/draft/${this.leagueId}` })
        }
      }
    }
  },
  mounted () {
    fireInit()
  },
  methods: {
    addToRoster (player) {
      this.roster.push(player)
    },
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
    draftPreference () {
      this.$router.push({ path: `/draftPreference/${this.leagueId}` })
    },
    getLeague (leagueId) {
      this.$store.dispatch('setLoading', true)
      LeagueService.getLeague(leagueId)
        .then((league) => {
          this.league = { ...this.league, ...league }
          this.getLeagueUsers(leagueId)
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
    getLeagueUsers (leagueId) {
      this.$store.dispatch('setLoading', true)
      LeagueService.getLeagueUsers(leagueId)
        .then((users) => {
          this.leagueUsers = Object.values(users)
          this.listenForDraft()
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
    listenForDraft () {
      const db = firebase.database()
      db.ref(`/draft/${this.leagueId}`).on('value', (snapshot) => {
        const draft = snapshot.val()
        this.draftStatus = draft ? draft.status || 'unDrafted' : 'unDrafted'
      })
    },
    setLeague (leagueId) {
      this.$router.push({ path: `/leagues/${leagueId}` })
    },
    startDraft () {
      // we'll need to build out the random order and save that to draftOrder
      this.$store.dispatch('setLoading', true)
      let tmpUsers = []
      const schedule = LeagueService.generateSchedule(this.config.currentWeek, this.config.totalWeeks, this.leagueUsers)

      LeagueService.setSchedule(schedule, this.leagueId)
        .then(() => LeagueService.getLeagueUsers(this.leagueId))
        .then((users) => {
          tmpUsers = Object.values(users)
          const shuffledUsers = shuffle([...tmpUsers])
          const db = firebase.database()
          const draft = {
            selectedPlayers: [],
            players: this.players,
            activeDrafter: 0,
            direction: 'forward',
            status: 'active',
            doneProcessing: true
          }
          this.$store.dispatch('setLoading', true)
          db.ref(`/draftOrder/${this.leagueId}`)
            .set(shuffledUsers)
            .then(() => {
              db.ref(`/draft/${this.leagueId}`).set(draft)
            })
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
