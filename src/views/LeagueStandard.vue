<template lang="pug">
  .leagues
    .columns.is-marginless
      left-bar
        transfer-ownership(leagueType="standard" v-if="userData.isAdmin")
        your-leagues(:userId="userId")
        section(v-if="league.leagueType == 'standard' && !draftComplete && isInLeague")
          collapsible(title-text="Draft Preference List" :start-collapsed="true")
            p You can use this list to auto-draft for you in case you can't make it to the live draft!  Make sure to enable "Auto Draft" if you need it to pick based on your preference list while you're gone!
            hr
            button.button.is-primary(@click="draftPreference") Draft Preference List
        section(v-if="leagueUsers && leagueUsers.length")
          collapsible(:title-text="`League Users (${leagueUsers.length})`")
            h3
              span.orange {{ leagueUsers.length }}
              |  of
              span.orange  10
            .left-bar-item(v-for="user in leagueUsers") {{ user.displayName }}
        section(v-if="canLeaveLeague")
          confirm-button(buttonText="Leave League" confirmText="Are You Sure?" @confirm-it="leaveLeague")
        section(v-if="isOwner")
          collapsible(title-text="League Password" :start-collapsed="true")
            b-field(label="Password")
              b-input(v-model="league.password")
            b-field
              button.button.is-primary(@click="updateLeague") Update Password
            p To remove the password, simply update with no password in the field.
        section
          router-link.button.is-primary.is-small(:to="`/manageTeam/${leagueId}`" v-if="draftComplete") Manage Team
          button.button.is-primary.is-small(disabled v-else) Manage Team
          button.button.is-secondary.is-small.is-pulled-right(@click="copyLink" v-if="isInLeague") Copy Share Link
      .column(v-if="league.leagueName")
        h1 {{ league.leagueName }}
        section(v-if="liveConfig.canStartDraft && canStartDraft")
          .columns.is-mobile.is-button-header
            .column
              h2 Start Draft
            .column.is-narrow
              confirm-button(:customClasses="{'is-primary': true,'is-small': true,'is-pulled-right':true}" buttonText="Start Draft" confirmText="Are You Sure?" @confirm-it="startDraft")
        section(v-if="!liveConfig.canStartDraft")
          span {{ liveConfig.featureDownMessage }}
        section(v-if="isOwner && (!draftOrder || !draftOrder.length)")
          .columns.is-mobile.is-button-header(v-if="this.leagueUsers && this.leagueUsers.length % 2 === 0")
            .column
              h2 Create Draft Order
            .column.is-narrow
              confirm-button(:customClasses="{'is-primary': true,'is-small': true,'is-pulled-right':true}" buttonText="Create Draft Order" confirmText="Are You Sure?" @confirm-it="createSchedule" extraText="This action should be considered only when EVERYONE has joined your league.  This locks in the draft order and allows you to start the draft.")
          .wrap(v-else)
            p You need an even number of users in your league in order to create a draft order and start the draft!
        b-tabs(v-model="activeContentTab")
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
              vue-markdown(v-if="leagueMessage" :source="leagueMessage")
              .wrap(v-else)
                img(src="https://firebasestorage.googleapis.com/v0/b/overwatch-pickem.appspot.com/o/images%2Fleagues%2Fwelcome-to-your-league.jpg?alt=media&token=bbf8225c-6bd0-4b1a-b5e0-d864a3047395")
                p Click on the edit button above to customize your league landing page!  Inform members of the rules you have, the prizes you're giving away - whatever makes sense!
          b-tab-item(label="Your Roster" v-if="draftComplete && isInLeague")
            league-roster(:league="league")
          b-tab-item(label="Draft Order" v-if="draftOrder && draftOrder.length")
            p This is the order for the draft.  Keep in mind this is a snake draft.  If you have no idea what that means, it's similar to what
              a(href="https://www.dummies.com/sports/fantasy-sports/fantasy-football/understanding-fantasy-football-snake-and-auction-drafts/" target="_blank")  this page describes
              | .
            ol
              li(v-for="team in draftOrder") {{ team.displayName }}
          b-tab-item(label="Trash Talk")
            trash-talk
          b-tab-item(v-if="isOwner || userData.isAdmin" label="League Options")
            h2 League Options
            p We will be adding to this page to allow league owners more control over how their league is ran.  Stay tuned!
            remove-user(v-if="(isOwner && !draftComplete) || userData.isAdmin" leagueType="standard")
            section(v-if="canChangeScoringMode")
              collapsible(title-text="Raw Scoring")
                p This lets ALL scores a player accumulates during a week count, not just the best-of.  This is a more traditional scoring method and makes things more interesting!
                hr
                b-field(label="Raw Scoring")
                  b-switch(v-model="league.rawScoring")
            section(v-if="draftComplete")
              collapsible(title-text="Reset Draft")
                p This will reset the draft for all players in the league.  You may want to do this between stages, or there may have been an issue during the draft, whatever the reason, this is your key to resetting it!
                hr
                confirm-button(button-text="Reset Draft" confirm-text="Are You Sure?" @confirm-it="resetDraft")
            section(v-if="isOwner")
              collapsible(title-text="Delete League" :start-collapsed="true")
                confirm-button(button-text="Delete League" confirm-text="Are You Sure?" extra-text="This action can not be undone, and all users will lose their points and picks associated with this league." @confirm-it="deleteLeague")
        section(v-if="canJoinLeague")
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

import LeagueRoster from '@/views/leagues/LeagueRoster'
import LeagueSchedule from '@/views/leagues/LeagueSchedule'
import RemoveUser from '@/views/leagues/RemoveUser'
import TransferOwnership from '@/views/admin/TransferOwnership'
import TrashTalk from '@/views/draft/TrashTalk'
import YourLeagues from '@/views/leagues/YourLeagues'

export default {
  name: 'StandardLeague',
  components: {
    LeagueRoster,
    LeagueSchedule,
    RemoveUser,
    vueMarkdown,
    TransferOwnership,
    TrashTalk,
    YourLeagues
  },
  data () {
    return {
      league: {
        message: '',
        image: ''
      },
      activeContentTab: 0,
      localPassword: '',
      editingMessage: false,
      draftStatus: '',
      showLeagueUsers: false,
      showDraftPreference: false,
      showMenu: true
    }
  },
  computed: {
    canChangeScoringMode () {
      // we'll want to find out if they have points, if they do, disable it.
      return true
    },
    canJoinLeague () {
      // Needs to check league type, number of users, league status, etc.
      if (this.league.leagueType === 'standard' && this.leagueUsers.length && this.leagueUsers.length > 11) return false
      if (this.league.isLocked) return false
      if (this.isInLeague) return false
      if (this.draftOrder.length) return false
      if (this.userData.isPremier || this.userData.isAdmin) return true
      if (this.userLeagues && this.userLeagues.length > 7) return false
      return true
    },
    canLeaveLeague () {
      return (!this.draftComplete && !this.isOwner && this.isInLeague)
    },
    canStartDraft () {
      return (this.isOwner && this.unDrafted && this.leagueUsers.length && this.leagueUsers.length % 2 === 0 && this.draftOrder && this.draftOrder.length)
    },
    config () {
      return this.$store.getters.getConfig
    },
    draftComplete () {
      return this.draftStatus === 'completed'
    },
    draftOrder () {
      return this.$store.getters.getDraftOrder
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
      return this.$store.getters.getLeagueUsers || []
    },
    liveConfig () {
      return this.$store.getters.getLiveConfig
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
          this.$store.dispatch('fetchLeagueUsers', { leagueId: val, leagueType: 'standard' })
          this.$store.dispatch('fetchDraftOrder', val)
          this.getLeague(val)
        }
      }
    },
    league: {
      deep: true,
      handler (val) {
        if (val && this.isOwner) {
          this.updateLeague()
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
      this.$copyText(`https://highnoon.gg/#/LeagueStandard/${this.leagueId}`)
        .then(() => {
          this.$toast.open({
            message: 'Successfully copied the link!',
            type: 'is-success',
            position: 'is-bottom'
          })
        })
    },
    createSchedule () {
      this.$store.dispatch('setLoading', true)
      const schedule = LeagueService.generateSchedule(this.config.currentWeek, this.config.totalWeeks, this.leagueUsers)

      if (!schedule) {
        this.$toast.open({
          message: 'Unable to generate schedule.  Try refreshing the page and trying again!',
          type: 'is-danger',
          position: 'is-bottom'
        })
      } else {
        LeagueService.setSchedule(schedule, this.leagueId)
          .then(() => {
            const shuffledUsers = shuffle([...this.leagueUsers])
            firebase.database().ref(`/draftOrder/${this.leagueId}`)
              .set(shuffledUsers)
              .then(() => {
                const draft = {
                  leagueName: this.league.leagueName,
                  players: this.players,
                  activeDrafter: 0,
                  direction: 'forward',
                  status: 'unDrafted',
                  doneProcessing: true
                }

                firebase.database().ref(`/draft/${this.leagueId}`).set(draft)
              })
              .catch(() => {
                this.$store.dispatch('setLoading', false)
                this.$toast.open({
                  message: 'Unable to generate schedule.  Try refreshing the page and trying again!',
                  type: 'is-danger',
                  position: 'is-bottom'
                })
              })
              .finally(() => {
                // snag the schedule that we created so it's set in vuex
                this.$store.dispatch('fetchDraftOrder', this.leagueId)
                this.$store.dispatch('fetchLeagueSchedule', this.leagueId)
                this.$store.dispatch('setLoading', false)
              })
          })
      }
    },
    deleteLeague () {
      LeagueService.deleteLeague(this.leagueId)
        .then(() => {
          this.$router.push({ path: `/leagues` })
        })
        .catch(() => {
          this.$.open({
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
    resetDraft () {
      this.$store.dispatch('setLoading', true)
      LeagueService.resetDraft(this.leagueId)
        .then(() => {
          this.$store.dispatch('setLoading', false)
        })
    },
    startDraft () {
      // we'll need to build out the random order and save that to draftOrder
      this.$store.dispatch('setLoading', true)

      const draft = {
        leagueName: this.league.leagueName,
        players: Object.values(this.players),
        activeDrafter: 0,
        direction: 'forward',
        status: 'active',
        started: Date.now(),
        doneProcessing: true
      }

      firebase.database().ref(`/draft/${this.leagueId}`).set(draft)
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
