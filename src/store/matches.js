import firebase from 'firebase/app'
import 'firebase/firestore'
import { fireInit } from '@/fireLogin'
import picksService from '@/services/picks'

fireInit()

var db = firebase.firestore()

export default {
  state: {
    matches: [],
    globalPickStats: {}
  },
  mutations: {
    SET_MATCHES: (state, payload) => {
      state.matches = [ ...payload ]
    },
    SET_GLOBAL_PICKS: (state, payload) => {
      state.globalPickStats = { ...payload }
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
    },
    fetchPickStats: ({ state, commit, dispatch }) => {
      if (!state.globalPickStats.length) {
        picksService.getGlobalPickRates()
          .then((thePicks) => {
            commit('SET_GLOBAL_PICKS', { ...thePicks })
          })
      }
    }
  },
  getters: {
    getMatches: state => state.matches,
    getPickStats: state => state.globalPickStats
  }
}
