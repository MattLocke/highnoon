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
      if (payload) {
        db.collection('userLeagues').doc(payload)
          .get()
          .then((leagues) => {
            let theLeagues = []
            if (leagues.exists) {
              theLeagues = Object.values(leagues.data())
            }
            context.commit('SET_LEAGUES', theLeagues)
          })
      } else {
        context.commit('SET_LEAGUES', [])
      }
    }
  },
  getters: {
    getUserLeagues: state => state.leagues
  }
}
