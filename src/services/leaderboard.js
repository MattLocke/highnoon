import firebase from 'firebase'
import {fireInit} from '@/helpers/firebase-helper'
import logger from '@/services/logger'

fireInit()
require('firebase/firestore')

var db = firebase.firestore()

export default {
  leaderboardSimple () {
    var users = []
    return db.collection('leaderboardSimple')
      .orderBy('points', 'desc')
      .limit(100)
      .get()
      .then(function (userSnapshot) {
        userSnapshot.forEach(function (luser) {
        // get the users from here, and add them to the list.
          users.push(luser.data())
        })
        return users
      })
  },
  getLeaderboard (boardType, limit) {
    var users = []
    return db.collection(boardType)
      .orderBy('points', 'desc')
      .limit(limit)
      .get()
      .then(function (userSnapshot) {
        userSnapshot.forEach(function (luser) {
        // get the users from here, and add them to the list.
          users.push(luser.data())
        })
        return users
      })
  },
  leaderboardByUser (userId, boardType) {
    logger.logIt('Getting leaderboard for user: ' + userId + ' in collection: ' + boardType)
    return db.collection(boardType)
      .doc(userId)
      .get()
      .then(function (doc) {
      // console.table(doc)
        if (doc.exists) return doc.data()
        else logger.errorIt('No doc found.')
      })
  },
  leaderboardStandard () {
    var users = []
    return db.collection('leaderboardStandard')
      .orderBy('points', 'desc')
      .limit(100)
      .get()
      .then(function (userSnapshot) {
        userSnapshot.forEach(function (luser) {
        // get the users from here, and add them to the list.
          users.push(luser.data())
        })
        return users
      })
  },
  leaderboardByCompId (compId) {
    logger.logIt('Getting comps for normal users with compId of: ' + compId)
    var users = []
    return db.collection('leagueUsers')
      .where('compId', '==', compId)
      .where('simpleMode', '==', false)
      .orderBy('points', 'desc')
      .get()
      .then(function (userSnapshot) {
        userSnapshot.forEach(function (luser) {
        // get the users from here, and add them to the list.
          users.push(luser.data())
        })
        return users
      })
  },
  homeLeaderboardByCompId (compId) {
    logger.logIt('Getting comps for normal users with compId of: ' + compId)
    var users = []
    return db.collection('leaderboardStandard')
      .orderBy('points', 'desc')
      .limit(10)
      .get()
      .then(function (userSnapshot) {
        userSnapshot.forEach(function (luser) {
        // get the users from here, and add them to the list.
          users.push(luser.data())
        })
        return users
      })
  },
  simpleLeaderboardByCompId (compId) {
    var users = []
    return db.collection('leagueUsers')
      .where('compId', '==', compId)
      .where('simpleMode', '==', true)
      .orderBy('points', 'desc')
      .get()
      .then(function (userSnapshot) {
        userSnapshot.forEach(function (luser) {
        // get the users from here, and add them to the list.
          users.push(luser.data())
        })
        return users
      })
  }
}
