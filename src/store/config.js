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
    loadConfig: (context, payload) => {
      context.commit('SET_CONFIG', payload)
    },
    saveLiveConfig: (context, payload) => {
      context.commit('SET_LIVE_CONFIG', payload)
    }
  },
  getters: {
    getConfig: state => state.config,
    getLiveConfig: state => state.liveConfig,
    getCurrentWeek: state => state.config.currentWeek
  }
}
