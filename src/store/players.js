import firebase from 'firebase/app'
import 'firebase/firestore'
import { fireInit } from '@/fireLogin'

fireInit()

var db = firebase.firestore()
db.settings({ timestampsInSnapshots: true })

export default {
  state: {
    players: [],
    lockedPlayers: []
  },
  mutations: {
    SET_PLAYERS: (state, payload) => {
      state.players = payload || []
    },
    SET_LOCKED_PLAYERS: (state, payload) => {
      state.lockedPlayers = payload || []
    }
  },
  actions: {
    setLockedPlayers ({ commit }, payload) {
      commit('SET_LOCKED_PLAYERS', payload)
    },
    getPlayers: ({ state, commit, dispatch }) => {
      if (!state.players.length) {
        dispatch('setLoading', true)
        let thePlayers = {}
        db.collection(`players`)
          .get()
          .then((players) => {
            players.docs.forEach(player => {
              const p = player.data()
              thePlayers[p.id] = p
            })
            return null
          })
          .then(() => {
            return db.collection(`playerStats`).get()
          })
          .then((stats) => {
            stats.docs.forEach(stat => {
              const s = stat.data()
              thePlayers[s.id] = { ...thePlayers[s.id], stats: s }
            })
            commit('SET_PLAYERS', thePlayers)
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
    getLockedPlayers: state => state.lockedPlayers,
    getPlayers: state => state.players
  }
}
