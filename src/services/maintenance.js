import firebase from 'firebase'
import {fireInit} from '@/helpers/firebase-helper'
import logger from '@/services/logger'

fireInit()
require('firebase/firestore')

var db = firebase.firestore()

export default {
  removeDuplicates () {
    logger.logIt('Getting match picks...')
    var matchPicks = []
    var batch = db.batch()
    return db.collection('matchPicks')
      .get()
      .then(function (querySnapshot) {
        var counter = 0
        querySnapshot.forEach(function (doc) {
          var tmp = doc.data()
          var entryString = tmp.matchId + '.' + tmp.userId + '.' + tmp.leagueId
          if (matchPicks.includes(entryString)) {
            batch.delete(db.collection('matchPicks').doc(doc.id))
            counter++
          } else matchPicks.push(entryString)
        })
        console.log('Finished.  Found ', counter, ' duplicates.')
        batch.commit().then(function () {
          return matchPicks
        })
      }, function (error) {
        logger.errorIt(error)
      })
  },
  cleanPointsForComp (compId) {
    logger.logIt('Cleaning out points for all the leagues. based on compId:' + compId)
    var users = []
    return db.collection('leagueUsers')
    // .where('compId', '==', compId)
      .get()
      .then(function (userSnap) {
        userSnap.forEach(function (user) {
          users.push(user.id)
        })
        // now we have the giant users object.
        return users
      })
  },
  applyClean (users) {
    console.log('found ' + users.length + ' users')
    var batch = db.batch()
    users.forEach(function (user) {
      var matchRef = db.collection('leagueUsers').doc(user)
      batch.update(matchRef, {'points': 0})
    })
    return batch.commit().then(function () {
      console.log('Updated users.')
      return true
    })
  },
  updateLeagueUsers (compId) {
    logger.logIt('Updating league users with compId for leaderboard stuff...')
    return db.collection('leagues')
      .where('data.competitionId', '==', compId)
      .get()
      .then(function (leagueSnapshot) {
        leagueSnapshot.forEach(function (league) {
          logger.logIt('We found the league: ' + league.id)
          var leagueData = league.data().data
          var simpleMode = leagueData.simpleMode || false
          return db.collection('leagueUsers')
            .where('leagueId', '==', league.id)
            .get()
            .then(function (luser) {
              luser.forEach(function (user) {
                logger.logIt('udpating: ' + user.id)
                return db.collection('leagueUsers').doc(user.id).update({'compId': compId, 'simpleMode': simpleMode})
              })
            })
        })
      })
  },
  deactivateOldLeagues (compId) {
    logger.logIt('Deactivating all the old leagues...')
    return db.collection('leagues')
      .where('data.competitionId', '==', compId)
      .get()
      .then(function (leagueSnapshot) {
        leagueSnapshot.forEach(function (league) {
          logger.logIt('We found the league: ' + league.id)
          // var leagueData = league.data().data
          return db.collection('leagueUsers')
            .where('leagueId', '==', league.id)
            .get()
            .then(function (luser) {
              luser.forEach(function (user) {
                logger.logIt('udpating: ' + user.id)
                return db.collection('leagueUsers').doc(user.id).update({'active': false})
              })
            })
        })
      })
  },
  moveLeagues (oldId, newId, newName) {
    logger.logIt('Moving leagues from ' + oldId + ' to ' + newId)
    return db.collection('leagues')
      .where('data.competitionId', '==', oldId)
      .get()
      .then(function (snapshot) {
        var batch = db.batch()
        snapshot.forEach(function (doc) {
          var tmp = doc.data()
          tmp.data.competitionId = newId
          tmp.data.competitionName = newName
          var tmpRef = db.collection('leagues').doc(doc.id)
          batch.update(tmpRef, tmp)
        })
        batch.commit().then(function () {
          return true
        })
      })
  },
  moveLeagueUsers (oldId, newId) {
    logger.logIt('Moving league users from ' + oldId + ' to ' + newId)
    return db.collection('leagueUsers')
      .where('compId', '==', oldId)
      .get()
      .then(function (snapshot) {
        var batch = db.batch()
        snapshot.forEach(function (doc) {
          var tmp = doc.data()
          tmp.compId = newId
          var tmpRef = db.collection('leagueUsers').doc(doc.id)
          batch.update(tmpRef, tmp)
        })
        batch.commit().then(function () {
          return true
        })
      })
  }
}
