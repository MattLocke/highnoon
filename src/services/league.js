import firebase from 'firebase/app'
import 'firebase/firestore'
import { fireInit } from '@/fireLogin'
import logger from '@/services/logger'

fireInit()

var db = firebase.firestore()
db.settings({ timestampsInSnapshots: true })

export default {
  createLeague (leagueData) {
    logger.logIt('Creating League...')
    const collection = leagueData.leagueType === 'pickem' ? 'pickemLeagues' : 'fantasyLeagues'

    // get the league ref so we have a reusable entity
    const leagueRef = db.collection(collection).doc()

    // get the leagueId as it's the glue for all of the batch stuff
    const leagueId = leagueRef.id

    // create data for other entry
    const leagueMeta = {
      lastViewed: null,
      leagueId,
      leagueName: leagueData.leagueName,
      leagueType: leagueData.leagueType
    }

    // get the userLeague ref
    const userRef = db.collection(`userLeagues/${leagueData.ownerId}/${leagueId}`).doc()

    // set up the batch
    const batch = db.batch()

    // set up the id for easy reference later
    leagueData.id = leagueId

    // create the league entry
    batch.set(leagueRef, leagueData)

    // create the userLeague entry
    batch.set(userRef, leagueMeta)

    logger.logIt(`Writing league in batch with id of: ${leagueId}`)

    return batch.commit()
      .then(() => leagueId)
      .catch(() => false)
  }
}
