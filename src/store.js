import Vue from 'vue'
import Vuex from 'vuex'

import config from '@/store/config'
import draft from '@/store/draft'
import leagues from '@/store/leagues'
import matches from '@/store/matches'
import players from '@/store/players'
import user from '@/store/user'
import loading from '@/store/loading'
import teams from '@/store/teams'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    config,
    draft,
    leagues,
    loading,
    matches,
    players,
    teams,
    user
  }
})
