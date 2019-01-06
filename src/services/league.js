import firebase from 'firebase/app'
import 'firebase/firestore'
import { fireInit } from '@/fireLogin'
import logger from '@/services/logger'
import { shuffle } from 'lodash'

fireInit()

var db = firebase.firestore()
db.settings({ timestampsInSnapshots: true })

export default {
  createLeague (user, leagueData) {
    logger.logIt('Creating League...')
    const collection = leagueData.leagueType === 'pickem' ? 'pickemLeagues' : 'fantasyLeagues'

    // get the league ref so we have a reusable entity
    const leagueRef = db.collection(collection).doc()

    // get the leagueId as it's the glue for all of the batch stuff
    const leagueId = leagueRef.id
    const ownerId = leagueData.ownerId
    const userId = user.id

    // create data for other entry
    const leagueMeta = {
      [leagueId]: {
        lastViewed: null,
        leagueId,
        ownerId,
        leagueName: leagueData.leagueName,
        leagueType: leagueData.leagueType
      }
    }

    // seed metadata for first league user
    const userMeta = {
      [userId]: {
        userId,
        displayName: user.displayName
      }
    }

    // get the user refs
    const userRef = db.collection('userLeagues').doc(ownerId)
    const leagueUserRef = db.collection('leagueUsers').doc(leagueId)

    // set up the batch
    const batch = db.batch()

    // set up the id for easy reference later
    leagueData.id = leagueId

    // create the league entry
    batch.set(leagueRef, leagueData)

    // create the userLeague entry
    batch.set(userRef, leagueMeta, { merge: true })
    batch.set(leagueUserRef, userMeta)

    logger.logIt(`Writing league in batch with id of: ${leagueId}`)

    return batch.commit()
      .then(() => leagueId)
      .catch((error) => Promise.reject(error))
  },
  generateSchedule (currentWeek, totalWeeks, leagueUsers) {
    // const currentWeek = this.config.currentWeek
    const half = leagueUsers.length / 2
    const weeks = {}
    const remainingWeeks = Number(totalWeeks) - Number(currentWeek)

    // Build a schedule for each of the remaining weeks.
    for (let i = 0; i < remainingWeeks; i++) {
      let homeTeams = shuffle([...leagueUsers])
      let offset = i % half
      let awayTeams = homeTeams.splice(offset, half)
      let week = []
      const weekNiceName = Number(currentWeek + i + 1)

      for (let j = 0; j < half; j++) {
        let matchup = {
          home: homeTeams[j],
          away: awayTeams[j]
        }
        week.push(matchup)
      }

      weeks[weekNiceName] = week
    }
    return weeks
  },
  getLeague (leagueId) {
    logger.logIt(`Getting league with id: ${leagueId}`)
    return db.collection('fantasyLeagues').doc(leagueId)
      .get()
      .then(league => league.data())
  },
  getLeagueUsers (leagueId) {
    return db.collection('leagueUsers').doc(leagueId)
      .get()
      .then(users => users.data())
  },
  getSchedule (leagueId) {
    return db.collection('leagueSchedule').doc(leagueId)
      .get()
      .then(schedule => schedule.data())
  },
  joinLeague (user, league) {
    // foundation Ids
    const leagueId = league.id
    const userId = user.id

    // set up the batch
    const batch = db.batch()

    // set up the refs
    const leagueRef = db.collection('leagueUsers').doc(leagueId)
    const userRef = db.collection('userLeagues').doc(userId)

    // build the meta data
    const leagueMeta = {
      [leagueId]: {
        lastViewed: null,
        leagueId,
        ownerId: league.ownerId,
        leagueName: league.leagueName,
        leagueType: league.leagueType
      }
    }
    const userMeta = {
      [userId]: {
        userId,
        displayName: user.displayName
      }
    }

    // set the data to the batch
    batch.set(leagueRef, userMeta, { merge: true })
    batch.set(userRef, leagueMeta, { merge: true })

    // return user meta on success, so we can append it on the front end
    return batch.commit()
      .then(() => userMeta)
      .catch(error => error)
  },
  leaveLeague (userId, leagueId) {
    // set up the batch
    const batch = db.batch()

    // make sure we point to the refs created when joining a league
    const leagueRef = db.collection('leagueUsers').doc(leagueId)
    const userRef = db.collection('userLeagues').doc(userId)

    let userLeagues = []

    return userRef.get()
      .then((leagues) => {
        const tmp = leagues.data()
        delete tmp[leagueId]
        userLeagues = tmp
        return null
      })
      .then(() => leagueRef.get())
      .then(leagueSnapshot => leagueSnapshot.data())
      .then((leagueData) => {
        const leagueTmp = leagueData
        delete leagueTmp[userId]
        batch.set(leagueRef, leagueTmp)
        batch.set(userRef, userLeagues)
        return batch.commit()
      })
  },
  setSchedule (schedule, leagueId) {
    return db.collection('leagueSchedule').doc(leagueId).set(schedule)
  },
  updateLeague (league) {
    // fantasyLeagues
    return db.collection('fantasyLeagues').doc(league.id)
      .set(league, { merge: true })
      .then(l => l)
  }
}
