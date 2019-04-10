import firebase from 'firebase/app'
import 'firebase/firestore'
import { fireInit } from '@/fireLogin'

fireInit()

var db = firebase.firestore()

export default {
  state: {
    teams: []
  },
  mutations: {
    SET_TEAMS: (state, payload) => {
      state.teams = payload
    }
  },
  actions: {
    getTeams: ({ state, commit }) => {
      db.collection('teams')
        .get()
        .then((teams) => {
          const theTeams = teams.docs.map(team => ({ ...team.data() }))
          commit('SET_TEAMS', theTeams)
        })
    }
  },
  getters: {
    getTeams: state => state.teams
  }
}
