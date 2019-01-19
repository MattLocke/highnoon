import firebase from 'firebase/app'
import 'firebase/firestore'
import { fireInit } from '@/fireLogin'

fireInit()

var db = firebase.firestore()
db.settings({ timestampsInSnapshots: true })

export default {
  state: {
    leagues: [],
    leagueUsers: [],
    leagueSchedule: []
  },
  mutations: {
    SET_LEAGUES: (state, payload) => {
      state.leagues = payload
    },
    SET_LEAGUE_USERS: (state, payload) => {
      state.leagueUsers = payload
    },
    SET_LEAGUE_SCHEDULE: (state, payload) => {
      state.leagueSchedule = payload
    }
  },
  actions: {
    getLeagues: ({ state, commit }, payload) => {
      if (payload && !state.leagues.length) {
        db.collection('userLeagues').doc(payload)
          .get()
          .then((leagues) => {
            let theLeagues = []
            if (leagues.exists) {
              theLeagues = Object.values(leagues.data())
            }
            commit('SET_LEAGUES', theLeagues)
          })
      }
    },
    fetchLeagueSchedule: ({ state, commit }, payload) => {
      if (payload && !state.leagueSchedule.length) {
        db.collection('leagueSchedule').doc(payload)
          .get()
          .then((leagueSchedule) => {
            let theLeagueSchedule = []
            if (leagueSchedule.exists) {
              theLeagueSchedule = Object.values(leagueSchedule.data())
            }
            commit('SET_LEAGUE_SCHEDULE', theLeagueSchedule)
          })
      }
    },
    fetchLeagueUsers: ({ state, commit }, payload) => {
      if (payload && !state.leagueUsers.length) {
        db.collection('standardLeagueUsers').doc(payload)
          .get()
          .then((leagueUsers) => {
            let theLeagueUsers = []
            if (leagueUsers.exists) {
              theLeagueUsers = Object.values(leagueUsers.data())
            }
            commit('SET_LEAGUE_USERS', theLeagueUsers)
          })
      }
    }
  },
  getters: {
    getUserLeagues: state => state.leagues,
    getLeagueUsers: state => state.leagueUsers,
    getLeagueSchedule: state => state.leagueSchedule
  }
}
