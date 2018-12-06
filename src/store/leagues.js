import firebase from 'firebase/app'
import 'firebase/firestore'
import { fireInit } from '@/fireLogin'

fireInit()

var db = firebase.firestore()
db.settings({ timestampsInSnapshots: true })

export default {
  state: {
    leagues: []
  },
  mutations: {
    SET_LEAGUES: (state, payload) => {
      state.leagues = payload
    }
  },
  actions: {
    getLeagues: (context, payload) => {
      db.collection(`userLeagues/${payload.userId}`)
        .get()
        .then((leagues) => {
          const theLeagues = leagues.docs.map(league => ({ id: league.id, ...league.data() }))
          context.commit('SET_LEAGUES', theLeagues)
        })
    }
  },
  getters: {
    getUserLeagues: state => state.leagues
  }
}
