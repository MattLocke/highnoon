import Vue from 'vue'
import Vuex from 'vuex'

import leagues from '@/store/leagues'
import user from '@/store/user'
import loading from '@/store/loading'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    loading,
    leagues
  }
})

/*
TODO:
  user
  leagues
  messages
  teams
  players
  schedule
*/
