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
    getPlayers: (context, payload) => {
      db.collection(`players`)
        .get()
        .then((players) => {
          const thePlayers = players.docs.map(player => ({ ...player.data() }))
          context.commit('SET_PLAYERS', thePlayers)
        })
    }
  },
  getters: {
    getPlayers: state => state.players
  }
}
