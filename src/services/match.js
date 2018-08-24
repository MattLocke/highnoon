import firebase from 'firebase'
import {fireInit} from '@/helpers/firebase-helper'
import logger from '@/services/logger'

fireInit()
require('firebase/firestore')

var db = firebase.firestore()

export default {
  createMatch (data) {
    return db.collection('matches').add(data)
      .then(function (matchRef) {
        return true
      })
  },
  setWinner (matchData, matchId) {
    // completedMatches
    var stageNum = 0
    switch (matchData.stage) {
      case 'Stage 1':
        stageNum = 1
        break
      case 'Stage 2':
        stageNum = 2
        break
      case 'Stage 3':
        stageNum = 3
        break
      case 'Stage 4':
        stageNum = 4
        break
      case 'Stage 5':
        stageNum = 5
        break
      default:
        stageNum = 1
        break
    }
    // Set this for Bob
    matchData.isComplete = true

    return db.collection('matches').doc(matchId)
      .update(matchData)
      .then(function () {
        return db.collection('completedMatches').add({
          'stageNumber': stageNum,
          'matchId': matchId
        }).then(ref => {
          return true
        })
      })
      .catch(function (error) {
        logger.errorIt(error)
        return false
      })
  },
  getActiveMatch () {
    var tmpReturn = []
    return db.collection('matches')
      .where('isLocked', '==', true)
      .where('awayScore', '==', '0')
      .where('homeScore', '==', '0')
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          var tmpSnap = doc.data()
          tmpSnap.id = doc.id
          tmpReturn.push(tmpSnap)
        })
        return tmpReturn
      })
  },
  getMatchById (matchId) {
    logger.logIt('Getting match with id of: ' + matchId)
    return db.collection('matches')
      .doc(matchId)
      .get()
      .then(function (doc) {
        if (doc.exists) return doc.data()
        else return false
      })
  },
  getLimitedLeagueMatches (compId, limit) {
    logger.logIt('Getting matches for comp with id: ' + compId)
    var tmpReturn = []
    var tmpSnap = {}
    return db.collection('matches')
      .where('compId', '==', compId)
      .where('isLocked', '==', false)
      .limit(limit)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          tmpSnap = doc.data()
          tmpSnap.id = doc.id
          tmpReturn.push(tmpSnap)
        })
        return tmpReturn
      }, function (error) {
        logger.errorIt(error)
      })
  },
  getLeagueMatches (compId) {
    logger.logIt('Getting matches for comp with id: ' + compId)
    var tmpReturn = []
    var tmpSnap = {}
    return db.collection('matches')
      .where('compId', '==', compId)
      .where('isLocked', '==', false)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          tmpSnap = doc.data()
          tmpSnap.id = doc.id
          tmpReturn.push(tmpSnap)
        })
        return tmpReturn
      }, function (error) {
        logger.errorIt(error)
      })
  },
  getAllLeagueMatches (compId) {
    logger.logIt('Getting matches for comp with id: ' + compId)
    var tmpReturn = []
    var tmpSnap = {}
    return db.collection('matches')
      .where('compId', '==', compId)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          tmpSnap = doc.data()
          tmpSnap.id = doc.id
          tmpReturn.push(tmpSnap)
        })
        return tmpReturn
      }, function (error) {
        logger.errorIt(error)
      })
  },
  getOldLeagueMatches (compId) {
    logger.logIt('Getting expired matches for comp with id: ' + compId)
    var tmpReturn = []
    var tmpSnap = {}
    return db.collection('matches')
      .where('compId', '==', compId)
      .where('isLocked', '==', true)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          tmpSnap = doc.data()
          tmpSnap.id = doc.id
          tmpReturn.push(tmpSnap)
        })
        return tmpReturn
      }, function (error) {
        logger.errorIt(error)
      })
  }
}
