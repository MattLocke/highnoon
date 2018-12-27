<template lang="pug">
  .leagues
    .columns.is-marginless
      left-bar
        section
          h2 Fantasy Leagues
          .left-bar-item(v-if="!fantasyLeagues.length") You currently have no Fantasy leagues.
          .left-bar-item.has-pointer(:class="{'active-item': $route.params.leagueId == league.leagueId}" v-for="league in fantasyLeagues" :key="league.leagueId" @click="setLeague(league.leagueId)") {{ league.leagueName }}
        section
          router-link.button.is-primary(to="/createLeague") Create League
        section
          router-link.button.is-primary(to="/draft") Test Draft
      .column(v-if="league.leagueName")
        .container
          .columns
            .column.is-narrow
              | [LEAGUE_IMAGE]
            .column
              h1 {{ league.leagueName }}
                button.button.is-primary.is-pulled-right.is-small(@click="draftPreference") Draft Preference List
              .social-icons
                span [TWITTER] [INSTAGRAM] [DISCORD]
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
          //- section
            .columns
              .column.has-text-right
                h2 TEAM AWESOME
                span.team-owner SouldrinK
                .roster
                  .ow-font AIMGOD
                  .ow-font LINKZR
                  .ow-font ARK
                  .ow-font MARO
                  .ow-font BIGGOOSE
                  .ow-font MICKIE
              .column.is-narrow
                span vs
              .column
                h2 TEAM OLD MAN DRINK
                span.team-owner Moosetube
                .roster
                  .ow-font FLOW3R
                  .ow-font STRIKER
                  .ow-font COOLMATT
                  .ow-font NEKO
                  .ow-font JJONAK
                  .ow-font BOOMBOX
          section(v-if="canJoinLeague")
            button.button.is-primary(@click="joinLeague()") Join League
          section(v-if="isInLeague && !isOwner")
            confirm-button(buttonText="Leave League" confirmText="Are You Sure?" @confirm-it="leaveLeague()")
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
    }
  },
  watch: {
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
          this.$store.dispatch('getLeagues', this.leagueId)
        })
    },
    leaveLeague () {
      // have to make sure we delete all the nodes.
    },
    listenForDraft () {
      const db = firebase.database()
      db.ref(`/draftStatus/${this.leagueId}`).on('value', (snapshot) => {
        this.draftStatus = snapshot.val()
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
