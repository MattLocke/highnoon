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
            .left-bar-item(v-for="user in sortedScoreboard") {{ user.displayName }} ({{ user.wins }}-{{ user.losses }})
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
        section(v-if="isOwner && canReschedule")
          p If you created your league this week, you can keep clicking this to generate a new schedule.  If you're showing as only being able to start next week, click this and it will re-generate a schedule for you.  :)
          hr
          button.button.is-primary(@click="createNewSchedule") Re-Create Schedule
      .column(v-if="league.leagueName")
        h2.orange.is-pulled-right(v-tooltip="league.rawScoring ? 'This uses all scores from a player for a given week.' : 'This uses only the best score from a players score for a given week.'") {{ league.rawScoring ? 'Raw Scoring' : 'Best Of Scoring' }}
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
          b-tab-item(label="League Home")
            section.league-message
              .columns
                .column
                .column.is-narrow
                  button.button.is-secondary.is-small(@click="editingMessage = !editingMessage" v-if="isOwner") {{ editingMessage ? 'cancel' : 'edit' }}
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
            section(v-if="canJoinLeague")
              b-field(label="password" v-if="league.password")
                b-input(type="password" v-model="localPassword")
              button.button.is-primary(@click="joinLeague") Join League
            section(v-if="isInLeague && !isOwner")
              confirm-button(buttonText="Leave League" confirmText="Are You Sure?" @confirm-it="leaveLeague")
          b-tab-item(label="Leaderboard")
            h2 League Leaderboard
            p Right now it's only sorted by win/loss.  I will probably add your internal "total points" to make the ranking more accurate soon!
            b-table(
              :data="sortedScoreboard"
              )
              template(slot-scope="props")
                b-table-column(label="Pos" field="pos" width="20" sortable)
                  span {{ props.row.pos }}
                b-table-column(label="User" field="displayName" width="180" sortable)
                  span {{ props.row.displayName || 'vacated' }}
                b-table-column(label="Team Name" field="teamName" sortable)
                  span {{ props.row.teamName || 'vacated' }}
                b-table-column(label="Wins" width="30" field="wins" sortable)
                  span {{ props.row.wins }}
                b-table-column(label="Losses" width="30" field="losses" sortable)
                  span {{ props.row.losses }}
                b-table-column(label="Ties" width="30" field="ties" sortable)
                  span {{ props.row.ties }}
          b-tab-item(label="Roster")
            league-roster(:league="league" v-if="draftComplete && isInLeague" :raw="league.rawScoring")
            section
              p This is the order for the draft.  Keep in mind this is a snake draft.  If you have no idea what that means, it's similar to what
                a(href="https://www.dummies.com/sports/fantasy-sports/fantasy-football/understanding-fantasy-football-snake-and-auction-drafts/" target="_blank")  this page describes
                | .
              hr
              draggable(v-model="draftOrderCopy" v-if="canStartDraft")
                .list-group-item.has-move-cursor(v-for="(player, index) in draftOrderCopy")
                  .columns
                    .column.is-narrow {{ Number(index) + 1 }}
                    .column {{ player.displayName }}
              ol(v-else)
                li(v-for="team in draftOrder") {{ team.displayName }}
          b-tab-item(label="Schedule")
            matchup
            league-schedule(v-if="draftComplete" :isOwner="isOwner")
            section(v-else)
              p This will be where you can view your upcoming matchups
          b-tab-item(label="Trash Talk")
            trash-talk
          b-tab-item(v-if="isOwner || userData.isAdmin" label="Options")
            h2 League Options
            p We will be adding to this page to allow league owners more control over how their league is ran.  Stay tuned!
            hr
            remove-user(v-if="(isOwner && !draftComplete) || userData.isAdmin" leagueType="standard")
            section(v-if="canChangeScoringMode")
              collapsible(title-text="Raw Scoring")
                p This lets ALL scores a player accumulates during a week count, not just the best-of.  This is a more traditional scoring method and makes things more interesting!
                hr
                b-field(label="Raw Scoring")
                  b-switch(v-model="league.rawScoring")
            section(v-show="draftComplete")
              collapsible(title-text="Reset Draft" :start-collapsed="true")
                p This will reset the draft for all players in the league.  You may want to do this between stages, or there may have been an issue during the draft, whatever the reason, this is your key to resetting it!
                hr
                confirm-button(button-text="Reset Draft" confirm-text="Are You Sure?" @confirm-it="resetDraft")
            section(v-if="isOwner")
              collapsible(title-text="Delete League" :start-collapsed="true")
                confirm-button(button-text="Delete League" confirm-text="Are You Sure?" extra-text="This action can not be undone, and all users will lose their points and picks associated with this league." @confirm-it="deleteLeague")
      .column(v-else)
        .container
          h1 Please select a league from the menu.
          p If you have not yet joined a league, you may create one or join a friends!
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'
import { forEach, orderBy, shuffle } from 'lodash'
import vueMarkdown from 'vue-markdown'

import LeagueService from '@/services/league'

import draggable from 'vuedraggable'
import LeagueRoster from '@/views/leagues/LeagueRoster'
import LeagueSchedule from '@/views/leagues/LeagueSchedule'
import Matchup from '@/views/leagues/Matchup'
import RemoveUser from '@/views/leagues/RemoveUser'
import TransferOwnership from '@/views/admin/TransferOwnership'
import TrashTalk from '@/views/draft/TrashTalk'
import YourLeagues from '@/views/leagues/YourLeagues'

export default {
  name: 'StandardLeague',
  components: {
    draggable,
    LeagueRoster,
    LeagueSchedule,
    Matchup,
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
      draftOrderCopy: [],
      showLeagueUsers: false,
      showDraftPreference: false,
      showMenu: true
    }
  },
  computed: {
    canChangeScoringMode () {
      // we'll want to find out if they have points, if they do, disable it.
      return (this.config.currentWeek === this.league.weekCreated)
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
    canReschedule () {
      return (this.draftComplete && this.league.weekCreated === this.config.currentWeek)
    },
    canStartDraft () {
      return (this.isOwner && this.unDrafted && this.leagueUsers.length && this.leagueUsers.length % 2 === 0 && this.draftOrder && this.draftOrder.length)
    },
    sortedScoreboard () {
      const ordered = orderBy(this.leagueUsers, lu => lu.win ? Object.values(lu.win).length : 0, ['desc'])
      ordered.forEach(u => {
        u.wins = u.win ? Object.values(u.win).length : 0
        u.ties = u.tie ? Object.values(u.tie).length : 0
        u.losses = u.loss ? Object.values(u.loss).length : 0
      })
      let i = 1
      const indexed = forEach(ordered, s => {
        s.pos = i
        i++
      })
      return indexed
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
    leanPlayers () {
      return Object.keys(this.players)
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
    draftOrder: {
      immediate: true,
      handler (val) {
        this.draftOrderCopy = [ ...val ]
      }
    },
    draftOrderCopy (val) {
      if (val) {
        LeagueService.updateDraftOrder(val, this.leagueId).then(() => {
          this.$toast.open({
            message: 'Successfully save the draft order!',
            type: 'is-success',
            position: 'is-bottom'
          })
        })
      }
    },
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
    createNewSchedule () {
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
        players: this.leanPlayers,
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
