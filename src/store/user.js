export default {
  state: {
    loggedIn: false,
    userData: {
      username: 'MrNotLoggedIn'
    },
    fireUserData: {
      uid: 0
    }
  },
  mutations: {
    LOGIN: (state, payload) => {
      state.loggedIn = true
      state.userData = payload
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
    getUserData: state => state.userData,
    getFBUserData: state => state.fireUserData,
    getUserId: state => state.fireUserData ? state.fireUserData.uid : 0
  }
}
