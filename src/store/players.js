import firebase from 'firebase/app'
import 'firebase/firestore'
import { fireInit } from '@/fireLogin'

fireInit()

var db = firebase.firestore()

export default {
  state: {
    players: [],
    lockedPlayers: [],
    playerScores: {},
    playerTotalScores: {}
  },
  mutations: {
    SET_PLAYERS: (state, payload) => {
      state.players = []
      state.players = payload || []
    },
    SET_LOCKED_PLAYERS: (state, payload) => {
      state.lockedPlayers = payload || []
    },
    SET_PLAYER_SCORES: (state, payload) => {
      state.playerScores = {}
      state.playerScores = payload || {}
    },
    SET_PLAYER_TOTAL_SCORES: (state, payload) => {
      state.playerTotalScores = {}
      state.playerTotalScores = payload || {}
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
          .then(() => db.collection(`playerStats`).get())
          .then((stats) => {
            stats.docs.forEach(stat => {
              const s = stat.data()
              thePlayers[s.id] = { ...thePlayers[s.id], stats: s }
            })
          })
          .catch((error) => {
            // TODO: update with proper error msg
            console.error(error)
          })
          .finally(() => {
            commit('SET_PLAYERS', thePlayers)
            dispatch('setLoading', false)
          })
      }
    },
    getPlayerScores ({ commit }, payload) {
      // console.log(`Getting scores based on ${payload}`)
      db.collection(`playerBestScores`)
        .doc(`${payload}`)
        .get()
        .then((players) => {
          const thePlayers = players.data()
          // console.log(`The Players: ${JSON.stringify(thePlayers)}`)
          commit('SET_PLAYER_SCORES', thePlayers)
          return null
        })
        .then(() => db.collection(`playerTotalScores`)
          .doc(`${payload}`)
          .get()
          .then((players) => {
            const thePlayers = players.data()
            // console.log(`The Players: ${JSON.stringify(thePlayers)}`)
            commit('SET_PLAYER_TOTAL_SCORES', thePlayers)
            return null
          })
        )
        .catch(e => {
          console.log(e)
        })
    }
  },
  getters: {
    getLockedPlayers: state => state.lockedPlayers,
    getPlayers: state => state.players,
    getPlayerScores: state => state.playerScores,
    getPlayerTotalScores: state => state.playerTotalScores
  }
}
