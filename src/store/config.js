import firebase from 'firebase/app'
import 'firebase/firestore'
import { fireInit } from '@/fireLogin'

fireInit()

var db = firebase.firestore()
db.settings({ timestampsInSnapshots: true })

export default {
  state: {
    config: {},
    liveConfig: {}
  },
  mutations: {
    SET_CONFIG: (state, payload) => {
      state.config = payload
    },
    SET_LIVE_CONFIG: (state, payload) => {
      state.liveConfig = payload
    }
  },
  actions: {
    loadConfig: (context) => {
      db.collection('config')
        .doc('owl')
        .onSnapshot((doc) => {
          context.commit('SET_CONFIG', doc.data())
        })
    },
    saveLiveConfig: (context, payload) => {
      context.commit('SET_LIVE_CONFIG', payload)
    }
  },
  getters: {
    getConfig: state => state.config,
    getLiveConfig: state => state.liveConfig
  }
}
