<template lang="pug">
  .draft-preference
    .columns
      left-bar(:showClose="false")
        h2 Draft Preference List
        section
          h3 Chosen Roles
          .columns.is-mobile
            .column.has-text-centered
              .big-number
                img(src="images/roles/offense-white.svg" alt="offense")
                | {{ offensePlayers.length }}
            .column.has-text-centered
              .big-number
                img(src="images/roles/support-white.svg" alt="support")
                | {{ supportPlayers.length }}
            .column.has-text-centered
              .big-number
                img(src="images/roles/tank-white.svg" alt="tank")
                | {{ tankPlayers.length }}
            //- .column.has-text-centered
              .big-number
                img(src="images/roles/flex-white.svg" alt="flex")
                | {{ flexPlayers.length }}
        section
          .columns
            .column
              confirm-button(buttonText="Delete Roster" confirmText="Are You Sure?" @confirm-it="deleteRoster")
            .column.has-text-right
              span {{ roster ? roster.length : 0 }}/100
        .left-bar-item.roster-player(v-if="roster" v-for="(player, index) in roster")
          .columns.is-mobile
            .column.is-narrow
              img(:src="`images/roles/${player.attributes.role}-white.svg`")
            .column.is-narrow
              img(:src="`/images/teams/${player.team}.svg`")
            .column
              span {{ player.name }}
            .column.is-narrow
              span.is-proper {{ player.stats.fantasyScore }}
            .column.is-narrow
              button.button.is-primary.is-small(@click="removePlayer(index)") X
      .column(v-if="roster.length < 100")
        .container
          router-link.button.is-primary.is-pulled-right.is-small(:to="`/leagues/${leagueId}`") Back to League
          h2 Preference list for:
            span.orange  {{ leagueData.leagueName }}
          section
            h3 Choose Your Players
            p This list will serve as a "preference" for the draft to the league it's associated with.  Keep in mind during the draft it may not always choose your highest available player.  If roles have not been fulfilled, it will fill those roles choosing the best it can from your list.  If your list is too short, we'll take the player with the highest High Noon Score.  Right now, the player list is fixed in order, so make your decisions carefully!  After I get more time, I'll add the ability to easily re-order the list.
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
            player-line(:player="player" :key="`${Math.random()}${player.id}`" v-for="player in filteredPlayers" @add-player="addToRoster($event)" :roster="roster" :canSelect="true")
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'

import LeagueService from '@/services/league'

import PlayerLine from '@/views/draft/PlayerLine'

export default {
  name: 'DraftPreference',
  components: {
    PlayerLine
  },
  data () {
    return {
      chosenOffense: 0,
      chosenSupport: 0,
      chosenTank: 0,
      chosenFlex: 0,
      filterText: '',
      filterTeam: '',
      filterRole: '',
      leagueData: [],
      roster: []
    }
  },
  computed: {
    stats () {
      return this.$store.getters.getStats
    },
    teams () {
      return this.$store.getters.getTeams
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
      return this.roster ? this.roster.filter(player => player.attributes.role === 'flex') : []
    },
    offensePlayers () {
      return this.roster ? this.roster.filter(player => player.attributes.role === 'offense') : []
    },
    supportPlayers () {
      return this.roster ? this.roster.filter(player => player.attributes.role === 'support') : []
    },
    tankPlayers () {
      return this.roster ? this.roster.filter(player => player.attributes.role === 'tank') : []
    },
    players () {
      return this.$store.getters.getPlayers
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
        if (val) {
          const db = firebase.database()
          db.ref(`/draftPreference/${this.leagueId}/${this.userId}`).on('value', (snapshot) => {
            console.log('heard back from db...')
            this.roster = snapshot.val() || []
          })
        }
      }
    }
  },
  mounted () {
    LeagueService.getLeague(this.leagueId)
      .then((leagueData) => {
        this.leagueData = leagueData
      })
  },
  methods: {
    addToRoster (player) {
      this.roster.push(player)
      this.updateRoster()
    },
    deleteRoster () {
      firebase.database().ref(`/draftPreference/${this.leagueId}/${this.userId}`).set(null)
    },
    removePlayer (index) {
      this.roster.splice(index, 1)
      this.updateRoster()
    },
    updateRoster () {
      const db = firebase.database()
      this.$store.dispatch('setLoading', true)
      db.ref(`/draftPreference/${this.leagueId}/${this.userId}`)
        .set(this.roster)
        .then(() => {
          this.$store.dispatch('setLoading', false)
        })
    }
  }
}
</script>

<style lang="scss">
  .roster-player {
    span {
      line-height: 20px;
    }
    img {
      height: 20px;
      width: auto;
      margin-bottom: -4px;
    }
  }
</style>
