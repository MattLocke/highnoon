import user from './modules/user'
import config from './modules/config'
import matchStats from './modules/matchStats'
import picks from './modules/picks'

export default {
  modules: {
    user,
    config,
    matchStats,
    picks
  },
  strict: true
}
