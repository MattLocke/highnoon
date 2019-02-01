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
    getPlayers: ({ state, commit, dispatch }) => {
      if (!state.players.length) {
        dispatch('setLoading', true)
        let thePlayers = {}
        db.collection(`players`)
          .get()
          .then((players) => {
            thePlayers = players.docs.map(player => ({ ...player.data() }))
            return null
          })
          .then(() => {
            return db.collection(`playerStats`).get()
          })
          .then((stats) => {
            const theStats = stats.docs.map(stat => ({ ...stat.data() }))
            const playersToSave = []
            thePlayers.forEach((player) => {
              const tmpStats = theStats.find(stat => stat.playerId === player.id) || { fantasyScore: 0 }
              player = { ...player, stats: tmpStats }
              playersToSave.push(player)
            })
            commit('SET_PLAYERS', playersToSave)
          })
          .catch((error) => {
            // TODO: update with proper error msg
            console.error(error)
          })
          .finally(() => {
            dispatch('setLoading', false)
          })
      }
    }
  },
  getters: {
    getPlayers: state => state.players
  }
}
