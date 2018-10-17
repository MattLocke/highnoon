import Vue from 'vue'
import Vuex from 'vuex'

import user from '@/store/user'
import loading from '@/store/loading'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    loading
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
