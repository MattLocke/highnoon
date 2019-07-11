import { get } from 'lodash'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { fireInit } from '@/fireLogin'

fireInit()

var db = firebase.firestore()

export default {
  state: {
    loggedIn: false,
    userData: {
      username: 'MrNotLoggedIn',
      isAdmin: false,
      teamTheme: ''
    },
    fireUserData: {
      uid: 0,
      user: {
        uid: 0
      }
    },
    picks: []
  },
  mutations: {
    LOGIN: (state, payload) => {
      state.userData = { ...payload } || {}
      state.loggedIn = true
    },
    LOGOUT: (state) => {
      state.loggedIn = false
      state.userData = {}
      state.fireUserData = {}
    },
    FBLOGIN: (state, payload) => {
      state.fireUserData = payload
    },
    SAVE_AVATAR: (state, payload) => {
      state.userData.profileImageUrl = payload
    },
    SET_PICKS: (state, payload) => {
      if (payload) state.picks = payload
    },
    SET_THEME: (state, payload) => {
      state.userData.teamTheme = payload
    }
  },
  actions: {
    fetchPicks: ({ state, commit, dispatch }) => {
      if (state.userData.id) {
        dispatch('setLoading', true)
        db.collection('matchPicks')
          .where('userId', '==', state.userData.id)
          .get()
          .then((picks) => {
            const picksMap = {}
            const thePicks = picks.docs.map(pick => {
              const pickData = pick.data()
              picksMap[pickData.matchId] = { ...pickData }
              return pickData
            })
            commit('SET_PICKS', picksMap)
            dispatch('setLoading', false)
          })
      }
    },
    logIn: (context, payload) => {
      context.commit('LOGIN', payload)
    },
    saveFireData: (context, payload) => {
      if (payload) context.commit('FBLOGIN', payload)
    },
    logOut: (context) => {
      context.commit('LOGOUT')
    },
    saveProfileAvatar: (context, payload) => {
      context.commit('SAVE_AVATAR', payload)
    },
    setTheme: (context, payload) => {
      context.commit('SET_THEME', payload)
    }
  },
  getters: {
    isLoggedIn: state => !!(get(state.fireUserData, 'uid', false)),
    isVerified: state => get(state.fireUserData, 'emailVerified', false),
    getUserData: state => state.userData,
    getFBUserData: state => state.fireUserData,
    getUserId: state => get(state.fireUserData, 'uid', 0),
    getUserPicks: state => state.picks,
    getEmailAddress: state => get(state.fireUserData, 'email', null)
  }
}
