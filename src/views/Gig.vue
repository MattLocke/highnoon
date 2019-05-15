<template lang="pug">
  .gig
    h1.orange GIG STATS
    section(v-if="rosterStats.standard")
      b-tabs(v-model="activeRosterTab" type="is-boxed")
        b-tab-item(v-for="(weekStats, week) in rosterStats.standard" :label="week" :key="week")
          b-table(:data="arrayOfPlayers")
            template(slot-scope="props")
              b-table-column(label="Role" width="30" field="role" sortable)
                span {{ props.row.role }}
              b-table-column(label="Team" width="30" field="team" sortable)
                span {{ props.row.team }}
              b-table-column(label="Player Name" field="name" sortable)
                span {{ props.row.name }}
              b-table-column(label="Cap")
                span {{ numTimes('captain', props.row.id, weekStats) }}
              b-table-column(label="Off1")
                span {{ numTimes('offense1', props.row.id, weekStats) }}
              b-table-column(label="Off2")
                span {{ numTimes('offense2', props.row.id, weekStats) }}
              b-table-column(label="Sup1")
                span {{ numTimes('support1', props.row.id, weekStats) }}
              b-table-column(label="Sup2")
                span {{ numTimes('support2', props.row.id, weekStats) }}
              b-table-column(label="Tnk1")
                span {{ numTimes('tank1', props.row.id, weekStats) }}
              b-table-column(label="Tnk2")
                span {{ numTimes('tank2', props.row.id, weekStats) }}
</template>

<script>
/*
  So for additional non-premium stats:
  X 1. Live Draft pick %
  2. Number of leagues (Standard and Unlimited) where player is currently on bench
  3. Number of leagues (Standard and Unlimited) where player is currently on roster

  And for premium stats:
  1. Elims
  2. Damage
  3. Healing
  4. Matches Played
  5. Time Played
  6. Free Agent %
  7. Times traded
  8. Hero playtime
*/
import firebase from 'firebase/app'
import 'firebase/database'

export default {
  name: 'StatsForGig',
  data () {
    return {
      activeRosterTab: 0,
      rosterStats: {}
    }
  },
  computed: {
    arrayOfPlayers () {
      return Object.values(this.players)
    },
    players () {
      return this.$store.getters.getPlayers
    },
    playerScores () {
      return this.$store.getters.getPlayerScores
    },
    playerTotalScores () {
      return this.$store.getters.getPlayerTotalScores
    }
  },
  methods: {
    numTimes (position, playerId, stats) {
      return stats[position][playerId] || 0
    }
  },
  mounted () {
    firebase.database().ref('/rosterStats').once('value').then(snapshot => {
      this.rosterStats = snapshot.val()
    })
  }
}
</script>
