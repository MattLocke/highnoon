import firebase from 'firebase/app'
import 'firebase/firestore'
import { fireInit } from '@/fireLogin'

fireInit()

var db = firebase.firestore()
db.settings({ timestampsInSnapshots: true })

export default {
  state: {
    matches: []
  },
  mutations: {
    SET_MATCHES: (state, payload) => {
      state.matches = payload
    }
  },
  actions: {
    fetchMatches: ({ state, commit, dispatch }) => {
      if (!state.matches.length) {
        dispatch('setLoading', true)
        db.collection('matches')
          .orderBy('startDateTS')
          .get()
          .then((matches) => {
            const theMatches = matches.docs.map(match => ({ ...match.data() }))
            commit('SET_MATCHES', theMatches)
            dispatch('setLoading', false)
          })
      }
    }
  },
  getters: {
    getMatches: state => state.matches
  }
}
