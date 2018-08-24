export default {
  state: {
    currentWeek: 'Week 1',
    currentStage: '',
    currentSeason: 1
  },
  mutations: {
    SAVECONFIG: (state, payload) => {
      state.currentWeek = payload.currentWeek
      state.currentStage = payload.currentStage
      state.currentSeason = payload.currentSeason
    }
  },
  actions: {
    saveConfig: (context, payload) => {
      context.commit('SAVECONFIG', payload)
    }
  },
  getters: {
    currentWeek: state => state.currentWeek,
    currentStage: state => state.currentStage,
    siteActive: state => state.siteActive
  }
}
