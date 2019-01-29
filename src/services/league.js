import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/database'
import { fireInit } from '@/fireLogin'
import logger from '@/services/logger'
import { shuffle } from 'lodash'

fireInit()

var db = firebase.firestore()
var rdb = firebase.database()
db.settings({ timestampsInSnapshots: true })

export default {
  createLeague (user, leagueData) {
    logger.logIt('Creating League...')

    // get the league ref so we have a reusable entity
    const leagueRef = db.collection(`${leagueData.leagueType}Leagues`).doc()

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
        displayName: user.displayName,
        teamName: `${user.displayName}'s Team`
      }
    }

    // get the user refs
    const userRef = db.collection('userLeagues').doc(ownerId)
    const leagueUserRef = db.collection(`${leagueData.leagueType}LeagueUsers`).doc(leagueId)

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
  deleteLeague (leagueId, leagueType = 'standard') {
    // set up the batch
    const batch = db.batch()

    // get the refs
    const leagueRef = db.collection(`${leagueType}Leagues`).doc(leagueId)
    const leagueUsersRef = db.collection(`${leagueType}LeagueUsers`).doc(leagueId)

    // get all of the league users so we can clean out the dead league
    return leagueUsersRef.get()
      .then((users) => {
        const userIds = users.data() ? Object.keys(users.data()) : []
        userIds.forEach((userId) => {
          // TODO: Make this support larger than 500 entries.
          // remove the league from each user's list by setting it to null
          batch.update(db.collection('userLeagues').doc(userId), { [leagueId]: firebase.firestore.FieldValue.delete() })
        })
        return true
      })
      .then(() => {
        batch.delete(leagueRef)
        batch.delete(leagueUsersRef)

        if (leagueType === 'pickem') {
          const picksRef = db.collection('pickemPicks').doc(leagueId)
          batch.delete(picksRef)
        }

        return batch.commit()
          .then(() => leagueId)
          .catch((error) => Promise.reject(error))
      })
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
  getLeague (leagueId, leagueType = 'standard') {
    logger.logIt(`Getting league with id: ${leagueId}`)
    return db.collection(`${leagueType}Leagues`).doc(leagueId)
      .get()
      .then(league => league.data())
  },
  getLeagueUsers (leagueId, leagueType = 'standard') {
    return db.collection(`${leagueType}LeagueUsers`).doc(leagueId)
      .get()
      .then(users => users.data())
  },
  getSchedule (leagueId) {
    return db.collection('leagueSchedule').doc(leagueId)
      .get()
      .then(schedule => schedule.data())
  },
  joinLeague (user, league, leagueType = 'standard') {
    // foundation Ids
    const leagueId = league.id
    const userId = user.id

    // set up the batch
    const batch = db.batch()

    // set up the refs
    const leagueRef = db.collection(`${leagueType}LeagueUsers`).doc(leagueId)
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
        displayName: user.displayName,
        teamName: `${user.displayName}'s Team`
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
  leaveLeague (userId, leagueId, leagueType = 'standard') {
    // set up the batch
    const batch = db.batch()

    // make sure we point to the refs created when joining a league
    const leagueRef = db.collection(`${leagueType}LeagueUsers`).doc(leagueId)
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
  resetDraft (leagueId) {
    return rdb.ref(`/draft/${leagueId}`).remove()
      .then(() => rdb.ref(`/draftPicks/${leagueId}`).remove())
      .then(() => db.collection('standardLeagueRoster').doc(leagueId).delete())
  },
  saveRoster (userId, leagueId, roster, type = 'standard') {
    const rosterObj = {
      [userId]: {
        roster,
        lastValid: Date.now()
      }
    }
    return db.collection(`${type}LeagueRoster`).doc(leagueId).set(rosterObj, { merge: true })
  },
  setSchedule (schedule, leagueId) {
    return db.collection('leagueSchedule').doc(leagueId).set(schedule)
  },
  updateLeague (league, leagueType = 'standard') {
    // fantasyLeagues
    return db.collection(`${leagueType}Leagues`).doc(league.id)
      .set(league, { merge: true })
      .then(l => l)
  }
}
