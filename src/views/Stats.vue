<template lang="pug">
  .stats
    .container
      h1 Player Stats
      section
        b-table(
          :data="playersWithStats"
          ref="table")
          template(slot-scope="props")
            b-table-column(label="ID" width="30" field="id" sortable)
              span {{ props.row.id }}
            b-table-column(label="Role" width="30" field="attributes.role" sortable)
              span {{ props.row.attributes.role }}
            b-table-column(label="Team" width="30" field="team" sortable)
              span {{ props.row.team }}
            b-table-column(label="Player Name" field="name" sortable)
              span {{ props.row.name }}
            b-table-column(label="Combined" width="40" field="totalScore" sortable)
              span {{ props.row.totalScore | playerScore }}
            b-table-column(label="Best" width="40" field="bestScore" sortable)
              span {{ props.row.bestScore | playerScore }}
</template>

<script>
import { forEach } from 'lodash'
import firebase from 'firebase/app'
import 'firebase/firestore'

export default {
  name: 'Stats',
  data () {
    return {
      bestScores: {},
      totalScores: {}
    }
  },
  computed: {
    players () {
      return this.$store.getters.getPlayers
    },
    playersWithStats () {
      const sPlayers = []
      forEach(this.players, player => {
        const tmp = {
          ...player,
          totalScore: this.totalScores[player.id],
          bestScore: this.bestScores[player.id]
        }
        sPlayers.push(tmp)
      })

      return sPlayers
    }
  },
  mounted () {
    var db = firebase.firestore()
    db.collection(`playerBestScores`)
      .doc(`1`)
      .get()
      .then((players) => {
        const thePlayers = players.data()
        // console.log(`The Players: ${JSON.stringify(thePlayers)}`)
        this.bestScores = thePlayers
        return null
      })
      .then(() => db.collection(`playerTotalScores`)
        .doc(`1`)
        .get()
        .then((players) => {
          const thePlayers = players.data()
          // console.log(`The Players: ${JSON.stringify(thePlayers)}`)
          this.totalScores = thePlayers
          return null
        })
      )
      .catch(e => {
        console.log(e)
      })
  }
}
</script>
