import { isEmpty } from 'lodash'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { fireInit } from '@/fireLogin'

fireInit()

var db = firebase.firestore()
db.settings({ timestampsInSnapshots: true })

export default {
  state: {
    featuredPickem: [],
    featuredUnlimited: [],
    leagues: [],
    leagueId: '',
    leagueRoster: {
      captain: {},
      offense1: {},
      offense2: {},
      support1: {},
      support2: {},
      tank1: {},
      tank2: {}
    },
    leagueUsers: [],
    leagueSchedule: []
  },
  mutations: {
    SET_FEATURED_PICKEM: (state, payload) => {
      if (payload) state.featuredPickem = payload
      else state.featuredPickem = []
    },
    SET_FEATURED_UNLIMITED: (state, payload) => {
      if (payload) state.featuredUnlimited = payload
      else state.featuredUnlimited = []
    },
    SET_LEAGUE_ID: (state, payload) => {
      state.leagueId = payload
    },
    SET_LEAGUES: (state, payload) => {
      if (payload) state.leagues = payload
      else state.leagues = []
    },
    SET_LEAGUE_ROSTER: (state, payload) => {
      if (payload) state.leagueRoster = payload
      else {
        state.leagueRoster = {
          captain: {},
          offense1: {},
          offense2: {},
          support1: {},
          support2: {},
          tank1: {},
          tank2: {}
        }
      }
    },
    SET_LEAGUE_USERS: (state, payload) => {
      if (payload) state.leagueUsers = payload
      else state.leagueUsers = []
    },
    SET_LEAGUE_SCHEDULE: (state, payload) => {
      if (payload) state.leagueSchedule = payload
      else state.leagueSchedule = []
    }
  },
  actions: {
    fetchFeaturedPickem: ({ state, commit }) => {
      if (!state.featuredPickem.length) {
        db.collection('pickemLeagues')
          .where('isFeatured', '==', true)
          .get()
          .then((leagues) => {
            const theLeagues = leagues.docs.map(league => ({ ...league.data() }))
            commit('SET_FEATURED_PICKEM', theLeagues)
          })
          .catch((error) => {
            console.table(error)
          })
      }
    },
    fetchFeaturedUnlimited: ({ state, commit }) => {
      if (!state.featuredUnlimited.length) {
        db.collection('unlimitedLeagues')
          .where('isFeatured', '==', true)
          .get()
          .then((leagues) => {
            const theLeagues = leagues.docs.map(league => ({ ...league.data() }))
            commit('SET_FEATURED_UNLIMITED', theLeagues)
          })
          .catch((error) => {
            console.table(error)
          })
      }
    },
    getLeagues: ({ commit }, payload) => {
      if (payload) {
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
    fetchLeagueSchedule: ({ commit }, payload) => {
      if (payload) {
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
    fetchLeagueUsers: ({ commit }, payload) => {
      if (payload.leagueId) {
        db.collection(`${payload.leagueType}LeagueUsers`).doc(payload.leagueId)
          .get()
          .then((leagueUsers) => {
            let theLeagueUsers = []
            if (leagueUsers.exists) {
              theLeagueUsers = Object.values(leagueUsers.data())
            }
            commit('SET_LEAGUE_USERS', theLeagueUsers)
          })
      }
    },
    fetchRoster: ({ state, commit }, payload) => {
      if (payload.leagueId !== state.leagueId || isEmpty(state.leagueRoster.length)) {
        db.collection(`${payload.leagueType}LeagueRoster`).doc(payload.leagueId)
          .get()
          .then((leagueRoster) => {
            let theLeagueRoster = {
              captain: {},
              offense1: {},
              offense2: {},
              support1: {},
              support2: {},
              tank1: {},
              tank2: {}
            }
            if (leagueRoster.exists) {
              theLeagueRoster = leagueRoster.data()
            }
            commit('SET_LEAGUE_ID', payload.leagueId)
            if (!isEmpty(theLeagueRoster)) commit('SET_LEAGUE_ROSTER', theLeagueRoster)
          })
      }
    }
  },
  getters: {
    getFeaturedPickem: state => state.featuredPickem,
    getFeaturedUnlimited: state => state.featuredUnlimited,
    getUserLeagues: state => state.leagues,
    getLeagueUsers: state => state.leagueUsers,
    getLeagueSchedule: state => state.leagueSchedule,
    getLeagueRoster: state => state.leagueRoster
  }
}
