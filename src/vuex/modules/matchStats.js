export default {
  state: {
    matchStats: []
  },
  mutations: {
    SAVESTATS: (state, payload) => {
      state.matchStats = payload
    }
  },
  actions: {
    saveStats: (context, payload) => {
      context.commit('SAVESTATS', payload)
    }
  },
  getters: {
    allMatches: state => state.matchStats,
    getMatchById: state => id => {
      return state.matchStats.find(matchup => matchup.matchId === id) || false
    }
  }
}
