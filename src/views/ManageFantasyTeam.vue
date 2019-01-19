<template lang="pug">
  .manage-fantasy-team
    .columns.is-marginless
      left-bar
        section
          collapsible(title-text="Your Bench")
            .left-bar-item Coming Soon
        section
          collapsible(title-text="Pending Trades" :start-collapsed="true")
            .left-bar-item Coming Soon
        section
          collapsible(title-text="Unclaimed Players" :start-collapsed="true")
            .left-bar-item Coming Soon
        section
          collapsible(title-text="Your Schedule")
            .left-bar-item Coming Soon
      .column
        section
          h1 Manage Your Fantasy Team
        .columns.is-multiline
          .column.is-narrow
            section
              h2 Captain
              b-field
                b-select(placeholder="Choose Captain" v-model="lineUp.captain")
                  option(v-for="player in myPicks" :value="player") {{ player.name }}
              player-card(:player="lineUp.captain" :showRemove="false" :score="lineUp.captain ? lineUp.captain.stats.fantasyScore : 0")
          .column
            section
              h2 Offense
              .columns
                .column.is-narrow
                  b-field
                    b-select(placeholder="Choose Player" v-model="lineUp.offense1")
                      option(v-for="player in myPlayersOffense" :value="player") {{ player.name }}
                  player-card(:player="lineUp.offense1" :showRemove="false" :score="lineUp.offense1 ? lineUp.offense1.stats.fantasyScore : 0")
                .column.is-narrow
                  b-field
                    b-select(placeholder="Choose Player" v-model="lineUp.offense2")
                      option(v-for="player in myPlayersOffense" :value="player") {{ player.name }}
                  player-card(:player="lineUp.offense2" :showRemove="false" :score="lineUp.offense2 ? lineUp.offense2.stats.fantasyScore : 0")
          .column
            section
              h2 Support
              .columns
                .column.is-narrow
                  b-field
                    b-select(placeholder="Choose Player" v-model="lineUp.support1")
                      option(v-for="player in myPlayersSupport" :value="player") {{ player.name }}
                  player-card(:player="lineUp.support1" :showRemove="false" :score="lineUp.support1 ? lineUp.support1.stats.fantasyScore : 0")
                .column.is-narrow
                  b-field
                    b-select(placeholder="Choose Player" v-model="lineUp.support2")
                      option(v-for="player in myPlayersSupport" :value="player") {{ player.name }}
                  player-card(:player="lineUp.support2" :showRemove="false" :score="lineUp.support2 ? lineUp.support2.stats.fantasyScore : 0")
          .column
            section
              h2 Tank
              .columns
                .column.is-narrow
                  b-field
                    b-select(placeholder="Choose Player" v-model="lineUp.tank1")
                      option(v-for="player in myPlayersTank" :value="player") {{ player.name }}
                  player-card(:player="lineUp.tank1" :showRemove="false" :score="lineUp.tank1 ? lineUp.tank1.stats.fantasyScore : 0")
                .column.is-narrow
                  b-field
                    b-select(placeholder="Choose Player" v-model="lineUp.tank2")
                      option(v-for="player in myPlayersTank" :value="player") {{ player.name }}
                  player-card(:player="lineUp.tank2" :showRemove="false" :score="lineUp.tank2 ? lineUp.tank2.stats.fantasyScore : 0")
        section
          collapsible(title-text="Bench" :start-collapsed="true")
        section
          collapsible(title-text="League Rosters" :start-collapsed="true")
            drafting-users(:users="leagueUsers" :draft="draft" :picks="draftPicks")
</template>

<script>
import DraftingUsers from '@/views/draft/DraftingUsers'
import PlayerCard from '@/components/PlayerCard'

export default {
  name: 'ManageTeam',
  components: {
    DraftingUsers,
    PlayerCard
  },
  data () {
    return {
      lineUp: {
        captain: null,
        offense1: null,
        offense2: null,
        support1: null,
        support2: null,
        tank1: null,
        tank2: null
      }
    }
  },
  computed: {
    draft () {
      return this.$store.getters.getDraft
    },
    draftPicks () {
      return this.$store.getters.getDraftPicks
    },
    leagueId () {
      return this.$route.params.leagueId
    },
    leagueSchedule () {
      return this.$store.getters.getLeagueSchedule
    },
    leagueUsers () {
      return this.$store.getters.getLeagueUsers
    },
    myLeagueSchedule () {
      return []
    },
    myPicks () {
      return this.draftPicks[this.userData.id] || []
    },
    players () {
      return this.$store.getters.getPlayers
    },
    myPlayersOffense () {
      return this.myPicks.filter(pick => pick.attributes.role === 'offense')
    },
    myPlayersSupport () {
      return this.myPicks.filter(pick => pick.attributes.role === 'support')
    },
    myPlayersTank () {
      return this.myPicks.filter(pick => pick.attributes.role === 'tank')
    },
    userData () {
      return this.$store.getters.getUserData
    }
  },
  mounted () {
    this.$store.dispatch('fetchDraft', this.leagueId)
    this.$store.dispatch('fetchDraftPicks', this.leagueId)
    this.$store.dispatch('fetchLeagueSchedule', this.leagueId)
    this.$store.dispatch('fetchLeagueUsers', this.leagueId)
    this.$store.dispatch('getPlayers')
    this.$store.dispatch('getTeams')
  }
}
</script>

<style lang="scss">
  .placeholder {
    width: 120px;
    height: 200px;
    background-color: rgba(0,0,0,0.3);
    border-radius: 8px;
    margin: 0 auto;
  }
</style>
