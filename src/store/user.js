import { get } from 'lodash'

export default {
  state: {
    loggedIn: false,
    userData: {
      username: 'MrNotLoggedIn'
    },
    fireUserData: {
      uid: 0,
      user: {}
    }
  },
  mutations: {
    LOGIN: (state, payload) => {
      state.userData = payload
      state.loggedIn = true
    },
    LOGOUT: (state) => {
      state.loggedIn = false
      state.userData = {}
      state.fireUserData = {}
    },
    FBLOGIN: (state, payload) => {
      state.fireUserData = payload
    }
  },
  actions: {
    logIn: (context, payload) => {
      context.commit('LOGIN', payload)
    },
    saveFireData: (context, payload) => {
      context.commit('FBLOGIN', payload)
    },
    logOut: (context) => {
      context.commit('LOGOUT')
    }
  },
  getters: {
    isLoggedIn: state => state.loggedIn,
    isVerified: state => get(state.fireUserData, 'emailVerified', false),
    getUserData: state => state.userData,
    getFBUserData: state => state.fireUserData,
    getUserId: state => state.fireUserData ? state.fireUserData.uid : 0
  }
}
