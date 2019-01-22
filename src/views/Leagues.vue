<template lang="pug">
  .leagues
    .columns.is-marginless
      left-bar
        section
          collapsible(title-text="Fantasy Leagues" :start-collapsed="isInLeague")
            h3 You are in
              span.orange  {{ fantasyLeagues.length }}
              |  of
              span.orange  8
              |  leagues
            .left-bar-item(v-if="!fantasyLeagues.length") You currently have no Fantasy leagues.
            .left-bar-item.has-pointer(:class="{'active-item': $route.params.leagueId == league.leagueId}" v-for="league in fantasyLeagues" :key="league.leagueId" @click="setLeague(league.leagueId)") {{ league.leagueName }}
            hr
            router-link.button.is-primary(to="/createLeague" v-if="userData.isAdmin || userData.isAlpha") Create League
        section(v-if="league.leagueType == 'standard' && league.status != 'complete' && isInLeague")
          collapsible(title-text="Draft Preference List" :start-collapsed="true")
            p You can use this list to auto-draft for you in case you can't make it to the live draft.
              b   Keep in mind, if you use this list, even if you're there for the live draft, this list will take priority and you will have no manual control!
            hr
            button.button.is-primary(@click="draftPreference") Draft Preference List
        section(v-if="leagueUsers.length")
          collapsible(title-text="League Users" :start-collapsed="true")
            .left-bar-item(v-for="user in leagueUsers") {{ user.displayName }}
        section(v-if="canLeaveLeague")
          confirm-button(buttonText="Leave League" confirmText="Are You Sure?" @confirm-it="leaveLeague")
        section(v-if="isOwner")
          collapsible(title-text="Delete League" :start-collapsed="true")
            confirm-button(button-text="Delete League" confirm-text="Are You Sure?" extra-text="This action can not be undone, and all users will lose their points and picks associated with this league." @confirm-it="deleteLeague")
        section
          router-link.button.is-primary.is-small(:to="`/manageTeam/${leagueId}`" :disabled="!draftComplete") Manage Team
          button.button.is-secondary.is-small.is-pulled-right(@click="copyLink" v-if="isInLeague") Copy Share Link
      .column(v-if="league.leagueName")
        section.is-hidden-mobile(v-if="!userData.isAdmin")
          p.orange This is alpha-only.  This page will continue to evolve as I work on it.  For now you can invite other alpha members to join your league, do a mock draft, and upon completion of that draft you'll be taken back here.  I'll be adding ways to reset the draft, see the schedule/etc over the next few days.  Stay tuned!  Deadlines are a loomin'!
        h1 {{ league.leagueName }}
        //- .social-icons
          span [TWITTER] [INSTAGRAM] [DISCORD]
        section(v-if="canStartDraft")
          .columns.is-mobile.is-button-header
            .column
              h2 Start Draft
            .column.is-narrow
              confirm-button(:customClasses="{'is-primary': true,'is-small': true,'is-pulled-right':true}" buttonText="Start Draft" confirmText="Are You Sure?" @confirm-it="startDraft") Start Draft
        section
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
        section(v-if="canJoinLeague && (userData.isAdmin || userData.isAlpha)")
          b-field(label="password" v-if="league.password")
            b-input(type="password" v-model="localPassword")
          button.button.is-primary(@click="joinLeague") Join League
        section(v-if="isInLeague && !isOwner")
          confirm-button(buttonText="Leave League" confirmText="Are You Sure?" @confirm-it="leaveLeague")
        league-schedule(v-if="draftComplete")
      .column(v-else)
        .container
          h1 Please select a league from the menu.
          p If you have not yet joined a league, you may create one or join a friends!
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'
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
      localPassword: '',
      editingMessage: false,
      draftStatus: '',
      showLeagueUsers: false,
      showDraftPreference: false,
      showMenu: true
    }
  },
  computed: {
    canJoinLeague () {
      // Needs to check league type, number of users, league status, etc.
      if (this.league.leagueType === 'standard' && this.leagueUsers.length > 11) return false
      if (this.leagueUsers.length > 11) return false
      if (this.league.isLocked) return false
      if (this.userLeagues.length > 8) return false
      if (this.isInLeague) return false
      return true
    },
    canLeaveLeague () {
      return (!this.draftComplete && !this.isOwner && this.isInLeague)
    },
    canStartDraft () {
      return (this.isOwner && this.unDrafted && this.leagueUsers.length % 2 === 0)
    },
    config () {
      return this.$store.getters.getConfig
    },
    draftComplete () {
      return this.draftStatus === 'completed'
    },
    isInLeague () {
      return this.userLeagues.some(league => league.leagueId === this.leagueId)
    },
    isOwner () {
      return this.userId === this.league.ownerId
    },
    leagueMessage () {
      return this.league.message
    },
    leagueUsers () {
      return this.$store.getters.getLeagueUsers
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
      return this.draftStatus === 'unDrafted'
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
        if (val) {
          this.$store.dispatch('fetchLeagueUsers', this.leagueId)
          this.getLeague(val)
        }
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
    draftPreference () {
      this.$router.push({ path: `/draftPreference/${this.leagueId}` })
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
      if (!schedule) {
        this.$toast.open({
          message: 'Unable to generate schedule.  Try refreshing the page and trying again!',
          type: 'is-danger',
          position: 'is-bottom'
        })
      }
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
