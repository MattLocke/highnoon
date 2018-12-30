<template lang="pug">
  .draft
    .columns.is-marginless
      left-bar(:showClose="false")
        h2 Your Roster - {{ roster.length }} of 9
        section
          .roster-section
            .columns.is-multiline.is-mobile
              .column.is-one-third-desktop.is-half-mobile(v-for="player in roster")
                player-card(:player="player" :showRemove="false" :primaryColor="getColor(player)" :score="player.stats.fantasyScore || 0")
              .column.is-one-third-desktop.is-half-mobile(v-for="placeholder in placeholders")
                player-card(:showRemove="false")
        section
          h3 Remaining Requirements
          .columns.is-mobile
            .column.has-text-centered
              .big-number
                img(src="images/roles/offense-white.svg" alt="offense")
                | {{ remaining.offense }}
            .column.has-text-centered
              .big-number
                img(src="images/roles/support-white.svg" alt="support")
                | {{ remaining.support }}
            .column.has-text-centered
              .big-number
                img(src="images/roles/tank-white.svg" alt="tank")
                | {{ remaining.tank }}
            .column.has-text-centered
              .big-number
                img(src="images/roles/flex-white.svg" alt="flex")
                | {{ remaining.flex }}
        h3 Draft Order
        .left-bar-item(v-for="(user, index) in users" :class="{'active-item': index === draft.activeDrafter}")
          .columns.is-mobile
            .column.is-narrow
              span {{ index + 1 }}
            .column
              span {{ user.displayName }}
      .column
        h2 Draft For Some Awesome League
        //- Choose your player
        .columns.is-desktop(v-if="myTurn")
          .column(v-if="roster.length < 9")
            section
              h3 Choose Your Player
            section
              .columns
                .column.is-narrow
                  b-field(label="Filter Team")
                    b-select(placeholder="Filter By Team" v-model="filterTeam")
                      option(value="") All
                      option(v-for="team in teams" :value="team.abbreviatedName") {{ team.name }}
                .column.is-narrow
                  b-field(label="Filter Role")
                    b-select(placeholder="Filter By Role" v-model="filterRole")
                      option(value="") All
                      option(value="flex") Flex
                      option(value="offense") Offense
                      option(value="support") Support
                      option(value="tank") Tank
              b-field(label="Filter Players")
                b-input(type="text" v-model="filterText")
            section
              player-line(:player="player" :key="`${Math.random()}${player.id}`" v-for="player in filteredPlayers" @add-player="addToRoster($event)" :canSelect="canSelect(player)" :roster="selectedPlayers")
          .column(v-else)
            section
              p Congrats!  Your team is complete!
          .column.is-hidden-touch
            .columns.is-multiline
              .column.is-narrow.draft-user(v-for="(user, index) in users" :class="{'active-item': index === draft.activeDrafter}")
                span {{ index + 1 }}. {{ user.displayName }}
            trash-talk
        .column(v-else)
          //- See how the draft is going
          section
            h3 Currently Drafting:
              span.orange  {{ users[draft.activeDrafter].displayName }}
          .columns.is-multiline.is-mobile
            .column.is-one-fifth-desktop.is-half-mobile(v-for="(userPicks, index) in picks")
              h3(:class="{'orange': index == users[draft.activeDrafter].userId}") {{ getUserName(index) }}
              ul
                player-card(v-for="pick in userPicks" :key="pick.id" :player="pick" :showRemove="false" :primaryColor="getColor(pick)" :score="pick.stats.fantasyScore || 0" :hidePhoto="true") {{ pick.name }}
      draft-drawer(:roster="roster")
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'

import DraftDrawer from '@/views/draft/DraftDrawer'
import PlayerCard from '@/components/PlayerCard'
import PlayerLine from '@/views/draft/PlayerLine'
import TrashTalk from '@/views/draft/TrashTalk'

export default {
  name: 'Draft',
  components: {
    DraftDrawer,
    PlayerCard,
    PlayerLine,
    TrashTalk
  },
  data () {
    return {
      draft: {
        activeDrafter: null
      },
      filterText: '',
      filterTeam: '',
      filterRole: '',
      picks: [],
      users: [],
      requiredFlex: 0,
      requiredOffense: 2,
      requiredSupport: 2,
      requiredTank: 2
    }
  },
  computed: {
    players () {
      return this.$store.getters.getPlayers
    },
    myTurn () {
      if (this.users.length) return this.users[this.draft.activeDrafter].userId === this.userId
      return false
    },
    roster () {
      return this.picks[this.userId] || []
    },
    stats () {
      return this.$store.getters.getStats
    },
    teams () {
      return this.$store.getters.getTeams
    },
    selectedPlayers () {
      let selected = []
      Object.keys(this.picks).forEach((key) => {
        selected = [...selected, ...this.picks[key]]
      })
      return selected
    },
    placeholders () {
      let remaining = 9 - this.roster.length
      let tmp = []
      for (let i = 0; i < remaining; i++) {
        tmp.push(['placeholder'])
      }
      return tmp
    },
    filteredPlayers () {
      let fPlayers = [...this.players]

      if (this.filterText) fPlayers = fPlayers.filter(player => player.name.toLowerCase().includes(this.filterText.toLowerCase()))
      if (this.filterRole) fPlayers = fPlayers.filter(player => player.attributes.role === this.filterRole)
      if (this.filterTeam) fPlayers = fPlayers.filter(player => player.team === this.filterTeam)
      fPlayers = fPlayers.sort(function (a, b) { return (a.stats.fantasyScore < b.stats.fantasyScore) ? 1 : ((b.stats.fantasyScore < a.stats.fantasyScore) ? -1 : 0) })
      return fPlayers
    },
    flexPlayers () {
      return this.roster.filter(player => player.attributes.role === 'flex')
    },
    offensePlayers () {
      return this.roster.filter(player => player.attributes.role === 'offense')
    },
    supportPlayers () {
      return this.roster.filter(player => player.attributes.role === 'support')
    },
    tankPlayers () {
      return this.roster.filter(player => player.attributes.role === 'tank')
    },
    remaining () {
      const remaining = {}
      remaining.flex = this.requiredFlex - this.flexPlayers.length > 0 ? this.requiredFlex - this.flexPlayers.length : 0
      remaining.offense = this.requiredOffense - this.offensePlayers.length > 0 ? this.requiredOffense - this.offensePlayers.length : 0
      remaining.tank = this.requiredTank - this.tankPlayers.length > 0 ? this.requiredTank - this.tankPlayers.length : 0
      remaining.support = this.requiredSupport - this.supportPlayers.length > 0 ? this.requiredSupport - this.supportPlayers.length : 0
      return remaining
    },
    totalRemaining () {
      return this.remaining.flex + this.remaining.offense + this.remaining.support + this.remaining.tank
    },
    userId () {
      return this.$store.getters.getUserId
    },
    leagueId () {
      return this.$route.params.leagueId
    }
  },
  watch: {
    draft: {
      handler (val) {
        if (!val || val.status !== 'active') this.$router.push({ path: `/leagues/${this.leagueId}` })
      }
    },
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
        if (val) {
          this.getPicks()
          this.getDraft()
          this.getDraftOrder()
        }
      }
    },
    teams: {
      immediate: true,
      handler (val) {
        if (val && val.length === 0) this.$store.dispatch('getTeams')
      }
    }
  },
  methods: {
    addToRoster (player) {
      this.$store.dispatch('setLoading', true)
      const db = firebase.database()
      const tmp = [...this.roster]
      tmp.push(player)

      db.ref(`/draftPicks/${this.leagueId}/${this.userId}`)
        .set(tmp)
        .then(() => {
          return db.ref(`/draft/${this.leagueId}`)
            .update({ doneProcessing: false })
        })
        .then(() => {
          this.$store.dispatch('setLoading', false)
        })
    },
    getDraft () {
      if (this.leagueId) {
        const db = firebase.database()
        db.ref(`/draft/${this.leagueId}`).on('value', (snapshot) => {
          this.draft = snapshot.val()
        })
      }
    },
    getDraftOrder () {
      if (this.leagueId) {
        const db = firebase.database()
        db.ref(`/draftOrder/${this.leagueId}`).on('value', (snapshot) => {
          this.users = snapshot.val()
        })
      }
    },
    getPicks () {
      const db = firebase.database()
      db.ref(`/draftPicks/${this.leagueId}`).on('value', (snapshot) => {
        this.picks = snapshot.val() || []
      })
    },
    getColor (player) {
      const team = this.teams.filter(team => team.abbreviatedName === player.team)[0]
      if (team) return team.primaryColor === '000000' ? team.secondaryColor : team.primaryColor
      return '222'
    },
    getScore (player) {
      const match = this.stats.filter(stat => stat.playerId === player.id)
      return match[0] ? match[0].fantasyScore : 0
    },
    getUserName (id) {
      return this.users.find(user => user.userId === id).displayName
    },
    canSelect (player) {
      // if they met all the requirements, they can pick whoever!
      if (!this.draft.doneProcessing) return false
      if (this.totalRemaining === 0) return true

      // if there is only enough for roles that need feeling, strict mode!
      const strictMode = !!(this.totalRemaining >= this.placeholders.length)

      switch (player.attributes.role) {
        case 'flex': {
          return strictMode ? !!(this.remaining.flex > 0) : true
        }
        case 'offense': {
          return strictMode ? !!(this.remaining.offense > 0) : true
        }
        case 'support': {
          return strictMode ? !!(this.remaining.support > 0) : true
        }
        case 'tank': {
          return strictMode ? !!(this.remaining.tank > 0) : true
        }
        default: return false
      }
    }
  }
}
</script>

<style lang="scss">
.draft {
  margin-bottom: 100px;
}
.draft-user {
  background-color: rgba(255,255,255,0.1);
  margin: .25rem;
  &.active-item {
    background-color: #f00;
  }
}
.draft-drawer {
  position: fixed;
  bottom: 0;
  background-color: rgba(0,0,0,0.8);
  width: 100%;
  .role-image {
    height: 18px;
    width: auto;
    margin-bottom: -3px;
  }
}
</style>
