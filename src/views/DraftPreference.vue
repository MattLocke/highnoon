<template lang="pug">
  .draft-preference
    div(:class="{'columns': !embedded}")
      left-bar(:showClose="false" :embedded="embedded")
        h2(v-if="!embedded") Draft Preference List
        section
          .field
            b-switch(v-model="autoMode") Enable Auto-Draft
          p This will let the system draft for you in case you can't make it to the live draft.  While active, picks will be placed on your behalf automatically, so be sure you want to enable this!
        section(v-if="!embedded")
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
        router-link.button.is-primary.is-pulled-right.is-small(:to="`/LeagueStandard/${leagueId}`" v-if="!embedded") Back to League
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
                  option(value="offense") Offense
                  option(value="support") Support
                  option(value="tank") Tank
          b-field(label="Filter Players")
            b-input(type="text" v-model="filterText")
        section
          b-table(
            :data="filteredPlayers"
            :loading="!(filteredPlayers.length)"
            ref="table"
            :paginated="filteredPlayers && filteredPlayers.length > 20"
            :per-page="20"
            :show-detail-icon="true")
            template(slot-scope="props")
              b-table-column(width="60")
                button.button.is-primary.is-small(@click="addToRoster(props.row)") Select
              b-table-column(label="Role" width="30" field="attributes.role" sortable)
                img(:src="`images/roles/${props.row.attributes.role || 'flex'}-white.svg`" width="22" height="22")
              b-table-column(label="Team" width="30" field="team" sortable)
                img(:src="`images/teams/${props.row.team}.svg`" width="22" height="22")
              b-table-column(label="Player Name" field="name" sortable)
                span {{ props.row.name }}
              b-table-column(label="Rating" width="40" field="stats.fantasyScore" sortable)
                span {{ props.row.stats.fantasyScore || 'N/A' }}
</template>

<script>
import _ from 'lodash'
import firebase from 'firebase/app'
import 'firebase/database'

import LeagueService from '@/services/league'

import PlayerLine from '@/views/draft/PlayerLine'

export default {
  name: 'DraftPreference',
  props: {
    embedded: {
      type: Boolean,
      default: false
    },
    seedPlayers: {
      type: Array,
      default: () => []
    }
  },
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
      roster: [],
      autoMode: false
    }
  },
  computed: {
    filteredPlayers () {
      let fPlayers = [...this.players]

      if (this.filterText) fPlayers = fPlayers.filter(player => player.name.toLowerCase().includes(this.filterText.toLowerCase()))
      if (this.filterRole) fPlayers = fPlayers.filter(player => player.attributes.role === this.filterRole)
      if (this.filterTeam) fPlayers = fPlayers.filter(player => player.team === this.filterTeam)
      fPlayers = _.differenceWith(fPlayers, this.roster, (a, b) => a.id === b.id)

      return fPlayers
    },
    flexPlayers () {
      return this.roster ? this.roster.filter(player => player.attributes.role === 'flex') : []
    },
    leagueId () {
      return this.$route.params.leagueId
    },
    offensePlayers () {
      return this.roster ? this.roster.filter(player => player.attributes.role === 'offense') : []
    },
    players () {
      return this.seedPlayers.length ? this.seedPlayers : this.$store.getters.getPlayers
    },
    stats () {
      return this.$store.getters.getStats
    },
    supportPlayers () {
      return this.roster ? this.roster.filter(player => player.attributes.role === 'support') : []
    },
    tankPlayers () {
      return this.roster ? this.roster.filter(player => player.attributes.role === 'tank') : []
    },
    teams () {
      return this.$store.getters.getTeams
    },
    userId () {
      return this.$store.getters.getUserId
    }
  },
  watch: {
    autoMode () {
      this.updateRoster()
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
          const db = firebase.database()
          db.ref(`/draftPreference/${this.leagueId}/${this.userId}`).on('value', (snapshot) => {
            console.log('heard back from db...')
            const tmp = snapshot.val()
            if (tmp) {
              this.roster = tmp.players || []
              this.autoMode = tmp.autoMode
            }
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
    this.$store.dispatch('getTeams')
  },
  methods: {
    addToRoster (player) {
      this.roster.push(player)
      this.updateRoster()
    },
    deleteRoster () {
      firebase.database().ref(`/draftPreference/${this.leagueId}/${this.userId}`).set(null)
        .then(() => {
          this.roster = []
        })
    },
    removePlayer (index) {
      if (this.roster && this.roster.length > 1) this.roster.splice(index, 1)
      else this.roster = []
      this.updateRoster()
    },
    updateRoster () {
      const db = firebase.database()
      const prefList = {
        autoMode: this.autoMode,
        players: this.roster
      }
      this.$store.dispatch('setLoading', true)
      db.ref(`/draftPreference/${this.leagueId}/${this.userId}`)
        .set(prefList)
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
