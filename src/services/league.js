import firebase from 'firebase/app'
import 'firebase/firestore'
import { fireInit } from '@/fireLogin'
import logger from '@/services/logger'

fireInit()

var db = firebase.firestore()
db.settings({ timestampsInSnapshots: true })

export default {
  createLeague (leagueData, leagueType) {
    const collection = leagueType === 'pickem' ? 'pickemLeagues' : 'fantasyLeagues'

    logger.logIt('Creating a new league.')
    return db.collection(collection).add(leagueData)
      .then(leagueRef => leagueRef.id)
      .catch((error) => {
        logger.errorIt(error)
        return false
      })
  }
}
