<template lang="pug">
  .draft
    .columns.is-marginless.is-desktop
      left-bar(:showClose="false")
        h2 Your Roster - {{ roster.length }} of 9
        section
          .roster-section
            .columns.is-multiline
              .column.is-one-third(v-for="player in roster")
                player-card(:player="player" :showRemove="false" :primaryColor="getColor(player)")
              .column.is-one-third(v-for="placeholder in placeholders")
                player-card(:showRemove="false")
        section
          h3 Requirements
          .columns
            .column
              span Offense:
              .remaining {{ remainingOffense || 'met' }}
            .column
              span Support:
              .remaining {{ remainingSupport || 'met' }}
            .column
              span Tank:
              .remaining {{ remainingTank || 'met' }}
            .column
              span Flex:
              .remaining {{ remainingFlex || 'met' }}
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
                player-line(:player="player" :key="`${Math.random()}${player.id}`" v-for="player in filteredPlayers" @add-player="addToRoster($event)" :canSelect="canSelect(player)")
            .column(v-else)
              section
                p Congrats!  Your team is complete!
            .column
              trash-talk
</template>

<script>
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

      return fPlayers.slice(0, 20)
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
    }
  },
  watch: {
    players: {
      immediate: true,
      handler (val) {
        if (val && val.length === 0) this.$store.dispatch('getPlayers')
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
      this.roster.push(player)
    },
    getColor (player) {
      const team = this.teams.filter(team => team.abbreviatedName === player.team)[0]
      if (team) return team.primaryColor === '000000' ? team.secondaryColor : team.primaryColor
      return '222'
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
