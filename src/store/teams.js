import firebase from 'firebase/app'
import 'firebase/firestore'
import { fireInit } from '@/fireLogin'

fireInit()

var db = firebase.firestore()
db.settings({ timestampsInSnapshots: true })

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
    getTeams: (context, payload) => {
      db.collection('teams')
        .get()
        .then((teams) => {
          const theTeams = teams.docs.map(team => ({ ...team.data() }))
          context.commit('SET_TEAMS', theTeams)
        })
    }
  },
  getters: {
    getTeams: state => state.teams
  }
}
