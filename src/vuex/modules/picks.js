export default {
  state: {
    leaguePicks: [],
    currentPickMatch: ''
  },
  mutations: {
    SAVEPICKS: (state, payload) => {
      state.leaguePicks = payload
    },
    SAVEPICKMATCH: (state, payload) => {
      state.currentPickMatch = payload
    }
  },
  actions: {
    savePicks: (context, payload) => {
      context.commit('SAVEPICKS', payload)
    },
    savePickMatch: (context, payload) => {
      context.commit('SAVEPICKMATCH', payload)
    }
  },
  getters: {
    allPicks: state => state.leaguePicks,
    getNextMatch: state => () => {
      let tmp = state.leaguePicks.findIndex(pick => pick === state.currentPickMatch)
      tmp += 1
      console.log('We set the index to: ', tmp)
      return state.leaguePicks[tmp] || false
    }
  }
}
