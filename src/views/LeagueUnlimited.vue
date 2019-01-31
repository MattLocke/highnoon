<template lang="pug">
  .leagues
    .columns.is-marginless
      left-bar
        your-leagues(:userId="userId")
        section(v-if="isOwner")
          collapsible(title-text="Delete League" :start-collapsed="true")
            confirm-button(button-text="Delete League" confirm-text="Are You Sure?" extra-text="This action can not be undone, and all users will lose their points and picks associated with this league." @confirm-it="deleteLeague")
        section(v-if="isInLeague")
          router-link.button.is-primary.is-small(:to="`/manageUnlimitedTeam/${leagueId}`") Manage Team
          button.button.is-secondary.is-small.is-pulled-right(@click="copyLink" v-if="isInLeague") Copy Share Link
      .column(v-if="league.leagueName")
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
        unlimited-leaderboard
</template>

<script>
import vueMarkdown from 'vue-markdown'

import LeagueService from '@/services/league'

import TrashTalk from '@/views/draft/TrashTalk'
import UnlimitedLeaderboard from '@/views/leagues/UnlimitedLeaderboard'
import YourLeagues from '@/views/leagues/YourLeagues'

export default {
  name: 'UnlimitedLeague',
  components: {
    TrashTalk,
    UnlimitedLeaderboard,
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
      LeagueService.joinLeague(this.userData, this.league)
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