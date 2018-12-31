<template lang="pug">
  .leagues
    .columns.is-marginless
      left-bar
        section
          h2 Fantasy Leagues
          .left-bar-item(v-if="!fantasyLeagues.length") You currently have no Fantasy leagues.
          .left-bar-item.has-pointer(:class="{'active-item': $route.params.leagueId == league.leagueId}" v-for="league in fantasyLeagues" :key="league.leagueId" @click="setLeague(league.leagueId)") {{ league.leagueName }}
        section(v-if="userData.isAdmin || userData.isAlpha")
          router-link.button.is-primary(to="/createLeague") Create League
      .column(v-if="league.leagueName")
        section
          p.orange This is alpha-only.  This page will continue to evolve as I work on it.  For now you can invite other alpha members to join your league, do a mock draft, and upon completion of that draft you'll be taken back here.  I'll be adding ways to reset the draft, see the schedule/etc over the next few days.  Stay tuned!  Deadlines are a loomin'!
        h1 {{ league.leagueName }}
          button.button.is-primary.is-pulled-right.is-small(@click="draftPreference") Draft Preference List
        .social-icons
          span [TWITTER] [INSTAGRAM] [DISCORD]
        section(v-if="isOwner && unDrafted")
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
          vue-markdown(:source="league.message")
        section(v-if="canJoinLeague && (userData.isAdmin || userData.isAlpha)")
          button.button.is-primary(@click="joinLeague") Join League
        section(v-if="isInLeague && !isOwner")
          confirm-button(buttonText="Leave League" confirmText="Are You Sure?" @confirm-it="leaveLeague")
        section(v-if="draftComplete")
          //- Show the "matchups"
        section
          h2 League Users
          p(v-for="user in leagueUsers") {{ user.displayName }}
      .column(v-else)
        h1 Please select a league from the left menu.
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'
import { fireInit } from '@/fireLogin'
import { shuffle } from 'lodash'

import vueMarkdown from 'vue-markdown'

import LeagueService from '@/services/league'

export default {
  name: 'Leagues',
  components: {
    vueMarkdown
  },
  data () {
    return {
      league: {
        message: '',
        image: ''
      },
      leagueUsers: [],
      editingMessage: false,
      draftStatus: ''
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
    isInLeague () {
      return this.userLeagues.some(league => league.leagueId === this.leagueId)
    },
    isOwner () {
      return this.userId === this.league.ownerId
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
    draftPreference () {
      this.$router.push({ path: `/draftPreference/${this.leagueId}` })
    },
    joinLeague () {
      this.$store.dispatch('setLoading', true)
      LeagueService.joinLeague(this.userData, this.league)
        .then(() => {
          this.$store.dispatch('setLoading', false)
          location.reload()
        })
    },
    leaveLeague () {
      // have to make sure we delete all the nodes.
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
    startDraft () {
      // we'll need to build out the random order and save that to draftOrder
      this.$store.dispatch('setLoading', true)
      let tmpUsers = []
      LeagueService.getLeagueUsers(this.leagueId)
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
