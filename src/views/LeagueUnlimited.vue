<template lang="pug">
  .leagues
    .container(v-if="league.leagueName")
      h1 {{ league.leagueName }}
      button.button.is-secondary.is-small.is-pulled-right.is-hidden-mobile(@click="copyLink" v-if="isInLeague") Copy Share Link
      b-tabs(v-model="activeContentTab" type="is-boxed" :animated="false")
        b-tab-item(label="League Message")
          .league-message
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
            vue-markdown(v-if="leagueMessage" :source="leagueMessage" :html="false")
            .wrap(v-else)
              img(src="https://firebasestorage.googleapis.com/v0/b/overwatch-pickem.appspot.com/o/images%2Fleagues%2Fwelcome-to-your-league.jpg?alt=media&token=bbf8225c-6bd0-4b1a-b5e0-d864a3047395")
              p Click on the edit button above to customize your league landing page!  Inform members of the rules you have, the prizes you're giving away - whatever makes sense!
        b-tab-item(label="Leaderboards")
          .leaderboard(v-if="liveConfig.canUseUnlimitedLeaderboards")
            h2 League Leaderboard
            p With the league leaderboard it will only show you if you have a score.  So if you just joined, don't fret!  Once we start the next scores you'll pop up.  Good luck!
            p.ow-font(v-if="isInLeague") Your Place:
              span.orange  {{ yourPlace }}
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
                b-table-column(label="S1" field="stage1Total" sortable width="100")
                  span {{ props.row.stage1Total | playerScore }}
                b-table-column(label="S2" field="stage2Total" sortable width="100")
                  span {{ props.row.stage2Total | playerScore }}
                b-table-column(label="Score" width="30" field="totalScore" sortable)
                  span {{ props.row.totalScore | playerScore }}
          .leaderboard(v-else)
            p The leaderboards are currently being worked on.  Stay tuned!
        b-tab-item(label="Your Roster" v-if="isInLeague")
          league-roster(:league="league" v-if="liveConfig.canCreateUnlimitedRoster")
          span(v-else) {{ liveConfig.featureDownMessage }}
          roster-history(:league="league")
        b-tab-item(label="Options")
          convert-to-featured(:league="league" v-if="userData.isAdmin")
          transfer-ownership(leagueType="unlimited" v-if="userData.isAdmin")
          remove-user(v-if="isOwner || userData.isAdmin" leagueType="unlimited")
          section(v-if="isOwner")
            collapsible(title-text="League Password" :start-collapsed="true")
              b-field(label="Password")
                b-input(v-model="league.password")
              b-field
                button.button.is-primary(@click="updateLeague") Update Password
            p To remove the password, simply update with no password in the field.
          section(v-if="isInLeague && !isOwner")
            confirm-button(buttonText="Leave League" confirmText="Are You Sure?" @confirm-it="leaveLeague")
        b-tab-item(label="Your Leagues")
          your-leagues(:userId="userId")
      trash-talk(v-if="isInLeague")
      section(v-if="canJoinLeague")
        b-field(label="password" v-if="league.password")
          b-input(type="password" v-model="localPassword")
        button.button.is-primary(@click="joinLeague") Join League
</template>

<script>
import { forEach, orderBy } from 'lodash'
import vueMarkdown from 'vue-markdown'

import LeagueService from '@/services/league'

import ConvertToFeatured from '@/views/admin/ConvertToFeatured'
import LeagueRoster from '@/views/leagues/LeagueRoster'
import RemoveUser from '@/views/leagues/RemoveUser'
import RosterHistory from '@/views/leagues/RosterHistory'
import SubMenu from '@/components/SubMenu'
import TransferOwnership from '@/views/admin/TransferOwnership'
import TrashTalk from '@/views/draft/TrashTalk'
import YourLeagues from '@/views/leagues/YourLeagues'

export default {
  name: 'UnlimitedLeague',
  components: {
    ConvertToFeatured,
    LeagueRoster,
    RemoveUser,
    RosterHistory,
    SubMenu,
    TransferOwnership,
    TrashTalk,
    vueMarkdown,
    YourLeagues
  },
  data () {
    return {
      activeContentTab: 0,
      editingMessage: false,
      draftStatus: '',
      league: {
        message: '',
        image: ''
      },
      localPassword: '',
      showLeagueUsers: false,
      showMenu: true
    }
  },
  computed: {
    canJoinLeague () {
      // Needs to check league type, number of users, league status, etc.
      if (this.league.leagueType !== 'unlimited') return false
      if (this.league.isLocked) return false
      if (this.isInLeague) return false
      if (this.userData.isPremier || this.userData.isAdmin) return true
      if (this.userLeagues && this.userLeagues.length > 7) return false
      return true
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
    players () {
      return this.$store.getters.getPlayers
    },
    sortedScoreboard () {
      const theUsers = this.leagueUsers
      const sorted = orderBy(theUsers, ['totalScore'], ['desc'])
      const filtered = sorted.filter(s => s.totalScore > 0)
      let i = 1
      const indexed = forEach(filtered, s => {
        s.pos = i
        i++
      })
      return indexed
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
    yourPlace () {
      if (this.isInLeague) {
        const userPlace = this.sortedScoreboard.find(s => s.userId === this.userId)
        if (userPlace) return `#${userPlace.pos} - ${Math.round(userPlace.totalScore)} pts`
        return 0
      }
      return 0
    }
  },
  watch: {
    leagueId: {
      immediate: true,
      handler (val) {
        if (val) {
          this.$store.dispatch('fetchLeagueUsers', { leagueId: this.leagueId, leagueType: 'unlimited' })
          this.getLeague(val)
        }
      }
    }
  },
  methods: {
    copyLink () {
      this.$copyText(`https://highnoon.gg/#/LeagueUnlimited/${this.leagueId}`)
        .then(() => {
          this.$toast.open({
            message: 'Successfully copied the link!',
            type: 'is-success',
            position: 'is-bottom'
          })
        })
    },
    deleteLeague () {
      LeagueService.deleteLeague(this.leagueId, 'unlimited')
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
      LeagueService.getLeague(leagueId, 'unlimited')
        .then((league) => {
          this.league = { ...this.league, ...league }
          this.$store.dispatch('setLoading', false)
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
      LeagueService.joinLeague(this.userData, this.league, 'unlimited')
        .then(() => {
          this.$store.dispatch('setLoading', false)
          location.reload()
        })
    },
    leaveLeague () {
      this.$store.dispatch('setLoading', true)
      LeagueService.leaveLeague(this.userId, this.leagueId, 'unlimited')
        .then(() => {
          this.$store.dispatch('setLoading', false)
          location.reload()
        })
    },
    updateLeague () {
      this.$store.dispatch('setLoading', true)
      LeagueService.updateLeague(this.league, 'unlimited')
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
