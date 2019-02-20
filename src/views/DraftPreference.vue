<template lang="pug">
  .draft-preference
    div(:class="{'columns': !embedded}")
      left-bar(:showClose="false" :embedded="embedded")
        h2(v-if="!embedded") Draft Preference List
        section
          .field
            b-switch(v-model="autoMode") Auto-Draft {{ autoMode ? 'Enabled' : 'Disabled' }}
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
        draggable(v-model="roster")
          .left-bar-item.roster-player.list-group-item(v-if="populatedRoster" v-for="(player, index) in roster")
            .columns.is-mobile
              .column.is-narrow
                img(:src="`images/roles/${playerObjects[player] ? playerObjects[player].attributes.role : 'flex'}-white.svg`" height="22" width="22")
              .column.is-narrow
                img(:src="`/images/teams/${playerObjects[player] ? playerObjects[player].team : 'DAL'}.svg`" height="22" width="22")
              .column
                span {{ playerObjects[player] ? playerObjects[player].name : 'N/A' }}
              .column.is-narrow
                span.is-proper {{ playerObjects[player] ? playerObjects[player].stats.fantasyScore : 0 | playerScore }}
              .column.is-narrow
                button.button.is-primary.is-small(@click="removePlayer(index)") X
      .column(v-if="roster.length < 100 && playersLoaded")
        router-link.button.is-primary.is-pulled-right.is-small(:to="`/LeagueStandard/${leagueId}`" v-if="!embedded") Back to League
        h2 Preference list for:
          span.orange  {{ leagueData.leagueName }}
        section
          collapsible(title-text="Choose Your Players" :start-collapsed="true")
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
            .column
              b-field(label="Filter Players")
                b-input(type="text" v-model="filterText")
        section
          b-table(
            :data="filteredPlayers"
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
                span {{ props.row.stats.fantasyScore | playerScore }}
</template>

<script>
import { differenceWith, isEmpty } from 'lodash'
import firebase from 'firebase/app'
import 'firebase/database'
import draggable from 'vuedraggable'

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
    draggable,
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
      populatedRoster: [],
      autoMode: false
    }
  },
  computed: {
    filteredPlayers () {
      let fPlayers = [...this.players]

      if (this.filterText) fPlayers = fPlayers.filter(player => player.name.toLowerCase().includes(this.filterText.toLowerCase()))
      if (this.filterRole) fPlayers = fPlayers.filter(player => player.attributes.role === this.filterRole)
      if (this.filterTeam) fPlayers = fPlayers.filter(player => player.team === this.filterTeam)
      fPlayers = differenceWith(fPlayers, this.roster, (a, b) => Number(a.id) === (b))

      return fPlayers
    },
    flexPlayers () {
      return []
    },
    leagueId () {
      return this.$route.params.leagueId
    },
    offensePlayers () {
      if (this.playersLoaded) return this.roster ? this.roster.filter(player => (this.playerObjects[player] && this.playerObjects[player].attributes.role === 'offense')) : []
      return []
    },
    playerObjects () {
      return this.$store.getters.getPlayers
    },
    players () {
      return this.seedPlayers.length ? this.seedPlayers : Object.values(this.$store.getters.getPlayers)
    },
    playersLoaded () {
      return !isEmpty(this.players)
    },
    stats () {
      return this.$store.getters.getStats
    },
    supportPlayers () {
      if (this.playersLoaded) return this.roster ? this.roster.filter(player => this.playerObjects[player].attributes.role === 'support') : []
      return []
    },
    tankPlayers () {
      if (this.playersLoaded) return this.roster ? this.roster.filter(player => this.playerObjects[player].attributes.role === 'tank') : []
      return []
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
          this.fillWithPlayers(val) // this is in case they come straight to page, and players aren't populated
        } else this.$store.dispatch('setLoading', false)
      }
    },
    roster: {
      immediate: true,
      handler (val) {
        this.populatedRoster = this.fillWithPlayers(val)
        if (val && val.length) this.updateRoster(val)
      }
    }
  },
  mounted () {
    LeagueService.getLeague(this.leagueId)
      .then((leagueData) => {
        this.leagueData = leagueData
      })

    const db = firebase.database()
    db.ref(`/draftPreference/${this.leagueId}/${this.userId}`).once('value', (snapshot) => {
      const tmp = snapshot.val()
      if (tmp) {
        this.roster = tmp.players || []
        this.autoMode = tmp.autoMode
      }
    })
  },
  methods: {
    addToRoster (player) {
      this.roster.push(Number(player.id))
    },
    deleteRoster () {
      firebase.database().ref(`/draftPreference/${this.leagueId}/${this.userId}`).set(null)
        .then(() => {
          this.roster = []
        })
    },
    fillWithPlayers (roster) {
      let tmp = {}
      roster.forEach(r => {
        tmp[r] = this.playerObjects[r]
      })
      return tmp
    },
    removePlayer (index) {
      if (this.roster && this.roster.length > 1) this.roster.splice(index, 1)
      else this.roster = []
    },
    updateRoster (val) {
      const db = firebase.database()
      const prefList = {
        autoMode: this.autoMode,
        players: [ ...val ]
      }
      this.$store.dispatch('setLoading', true)
      db.ref(`/draftPreference/${this.leagueId}/${this.userId}`)
        .set(prefList)
        .then(() => {
          this.$toast.open({
            message: 'Successfully updated the roster!',
            type: 'is-success',
            position: 'is-bottom'
          })
          this.$store.dispatch('setLoading', false)
        })
    }
  }
}
</script>

<style lang="scss">
  .roster-player {
    cursor: move;
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
