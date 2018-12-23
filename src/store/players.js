import firebase from 'firebase/app'
import 'firebase/firestore'
import { fireInit } from '@/fireLogin'

fireInit()

var db = firebase.firestore()
db.settings({ timestampsInSnapshots: true })

export default {
  state: {
    players: []
  },
  mutations: {
    SET_PLAYERS: (state, payload) => {
      state.players = payload
    }
  },
  actions: {
    getPlayers: (context) => {
      db.collection(`players`)
        .get()
        .then((players) => {
          const thePlayers = players.docs.map(player => ({ ...player.data() }))
          db.collection(`playerStats`)
            .get()
            .then((stats) => {
              const theStats = stats.docs.map(stat => ({ ...stat.data() }))
              const playersToSave = []
              thePlayers.forEach((player) => {
                const tmpStats = theStats.find(stat => stat.playerId === player.id) || { fantasyScore: 0 }
                player = { ...player, stats: tmpStats }
                playersToSave.push(player)
              })
              context.commit('SET_PLAYERS', playersToSave)
            })
        })
    }
  },
  getters: {
    getPlayers: state => state.players
  }
}
