import firebase from 'firebase/app'
import 'firebase/firestore'
import { fireInit } from '@/fireLogin'

fireInit()

var db = firebase.firestore()
db.settings({ timestampsInSnapshots: true })

export default {
  state: {
    config: {}
  },
  mutations: {
    SET_CONFIG: (state, payload) => {
      state.config = payload
    }
  },
  actions: {
    loadConfig: (context) => {
      db.collection('config')
        .doc('owl')
        .get()
        .then((configData) => {
          context.commit('SET_CONFIG', configData.data())
        })
    }
  },
  getters: {
    getConfig: state => state.config
  }
}
