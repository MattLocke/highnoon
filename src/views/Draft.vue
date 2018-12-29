<template lang="pug">
  .draft
    .columns.is-marginless.is-desktop
      left-bar(:showClose="false")
        h2 Your Roster - {{ roster.length }} of 9
        section
          .roster-section
            .columns.is-multiline
              .column.is-one-third(v-for="player in roster")
                player-card(:player="player" :showRemove="false" :primaryColor="getColor(player)" :score="player.stats.fantasyScore || 0")
              .column.is-one-third(v-for="placeholder in placeholders")
                player-card(:showRemove="false")
        section
          h3 Remaining Requirements
          .columns
            .column.has-text-centered
              .big-number
                img(src="images/roles/offense-white.svg" alt="offense")
                | {{ remainingOffense }}
            .column.has-text-centered
              .big-number
                img(src="images/roles/support-white.svg" alt="support")
                | {{ remainingSupport }}
            .column.has-text-centered
              .big-number
                img(src="images/roles/tank-white.svg" alt="tank")
                | {{ remainingTank }}
            .column.has-text-centered
              .big-number
                img(src="images/roles/flex-white.svg" alt="flex")
                | {{ remainingFlex }}
        h3 Draft Order
        .left-bar-item(v-for="(user, index) in users" :class="{'active-item': user.isActive}")
          .columns
            .column.is-narrow
              span {{ index + 1 }}
            .column
              span {{ user.userDisplayName }}
      .column
        .container
          h2 Draft For Some Awesome League
          .columns.is-desktop
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
                player-line(:player="player" :key="`${Math.random()}${player.id}`" v-for="player in filteredPlayers" @add-player="addToRoster($event)" :canSelect="canSelect(player)" :roster="roster")
            .column(v-else)
              section
                p Congrats!  Your team is complete!
            .column
              .columns.is-multiline
                .column.is-one-fifth.draft-user(v-for="(user, index) in users" :class="{'active-item': user.isActive}")
                  .columns
                    .column.is-narrow
                      span {{ index + 1 }}
                    .column
                      span {{ user.userDisplayName }}
              trash-talk
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'
import { fireInit } from '@/fireLogin'

import PlayerCard from '@/components/PlayerCard'
import PlayerLine from '@/views/draft/PlayerLine'
import TrashTalk from '@/views/draft/TrashTalk'

export default {
  name: 'Draft',
  components: {
    PlayerCard,
    PlayerLine,
    TrashTalk
  },
  data () {
    return {
      filterText: '',
      filterTeam: '',
      filterRole: '',
      users: [
        {
          userDisplayName: 'SouldrinK',
          isActive: true
        },
        {
          userDisplayName: 'Moosetube'
        },
        {
          userDisplayName: 'Morgahl'
        },
        {
          userDisplayName: 'Aretha'
        },
        {
          userDisplayName: 'Plague'
        },
        {
          userDisplayName: 'Rage'
        },
        {
          userDisplayName: 'Slothpaladin'
        },
        {
          userDisplayName: 'Peacecamper'
        },
        {
          userDisplayName: 'Sinyua'
        },
        {
          userDisplayName: 'Sneezle'
        },
        {
          userDisplayName: 'Gig'
        },
        {
          userDisplayName: 'Thawn'
        }
      ],
      roster: [],
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
    stats () {
      return this.$store.getters.getStats
    },
    teams () {
      return this.$store.getters.getTeams
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
    remainingFlex () {
      const num = this.requiredFlex - this.flexPlayers.length
      return num > 0 ? num : 0
    },
    remainingOffense () {
      const num = this.requiredOffense - this.offensePlayers.length
      return num > 0 ? num : 0
    },
    remainingSupport () {
      const num = this.requiredSupport - this.supportPlayers.length
      return num > 0 ? num : 0
    },
    remainingTank () {
      const num = this.requiredTank - this.tankPlayers.length
      return num > 0 ? num : 0
    },
    totalRemaining () {
      return this.remainingFlex + this.remainingOffense + this.remainingSupport + this.remainingTank
    },
    userId () {
      return this.$store.getters.getUserId
    },
    leagueId () {
      return this.$route.params.leagueId
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
        if (val) this.getRoster()
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
      const db = firebase.database()
      const tmp = [...this.roster]
      tmp.push(player)

      db.ref(`/draftPicks/${this.leagueId}/${this.userId}`)
        .set(tmp)
    },
    getRoster () {
      const db = firebase.database()
      db.ref(`/draftPicks/${this.leagueId}/${this.userId}`).on('value', (snapshot) => {
        this.roster = snapshot.val() || []
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
    canSelect (player) {
      // if they met all the requirements, they can pick whoever!
      if (this.totalRemaining === 0) return true

      // if there is only enough for roles that need feeling, strict mode!
      const strictMode = !!(this.totalRemaining >= this.placeholders.length)

      switch (player.attributes.role) {
        case 'flex': {
          return strictMode ? !!(this.remainingFlex > 0) : true
        }
        case 'offense': {
          return strictMode ? !!(this.remainingOffense > 0) : true
        }
        case 'support': {
          return strictMode ? !!(this.remainingSupport > 0) : true
        }
        case 'tank': {
          return strictMode ? !!(this.remainingTank > 0) : true
        }
        default: return false
      }
    }
  }
}
</script>

<style lang="scss">
.draft-user {
  background-color: rgba(255,255,255,0.1);
  margin: .25rem;
}
</style>
