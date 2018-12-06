import firebase from 'firebase/app'
import 'firebase/firestore'
import { fireInit } from '@/fireLogin'
import logger from '@/services/logger'

fireInit()

var db = firebase.firestore()
db.settings({ timestampsInSnapshots: true })

export default {
  createLeague (leagueData) {
    const collection = leagueData.leagueType === 'pickem' ? 'pickemLeagues' : 'fantasyLeagues'

    logger.logIt('Creating a new league.')
    return db.collection(collection).add(leagueData)
      .then(leagueRef => leagueRef.id)
      .then((leagueId) => {
        const leagueMeta = {
          lastViewed: null,
          leagueId,
          leagueName: leagueData.leagueName,
          leagueType: leagueData.leagueType
        }
        return db.collection(`userLeagues/${leagueData.ownerId}/${leagueId}`).add(leagueMeta)
          .then(metaRef => metaRef)
      })
      .catch((error) => {
        logger.errorIt(error)
        return false
      })
  }
}
