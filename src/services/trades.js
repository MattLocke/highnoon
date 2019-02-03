import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/database'
import { fireInit } from '@/fireLogin'
import logger from '@/services/logger'
// import { shuffle } from 'lodash'

fireInit()

// var db = firebase.firestore()
var rdb = firebase.database()
// db.settings({ timestampsInSnapshots: true })

export default {
  createTrade (trade) {
    logger.logIt('Creating Trade...')

    // get the user refs
    const tradeKey = rdb.ref(`trades/${trade.leagueId}`).push().key
    return rdb.ref(`trades/${trade.leagueId}/${tradeKey}`).set({ ...trade, id: tradeKey })
  }
}
