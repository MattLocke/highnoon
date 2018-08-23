import firebase from 'firebase'
import {fireInit} from '@/helpers/firebase-helper'
import logger from '@/services/logger'

fireInit()
require('firebase/firestore')

var db = firebase.firestore()

export default {
  teamPickPercentage (competitionId) {
    logger.logIt('Getting team pick percentages.')
  },
  saveMatchPickPercents (pickData) {
    logger.logIt('Setting match pick percentage.')
    return db.collection('pickStats').doc(pickData.matchId).set(pickData)
  },
  getMatchPickPercents (stage) {
    logger.logIt('Getting stats...')
    return db.collection('pickStats')
      .where('stage', '==', stage)
      .orderBy('startDate')
      .get()
      .then(function (snapshot) {
        var tmp = []
        snapshot.forEach(function (doc) {
          if (doc.exists) {
            var item = doc.data()
            tmp.push(item)
          }
        })
        return tmp
      })
  },
  getAllMatchPickPercents (tage) {
    logger.logIt('Getting stats...')
    return db.collection('pickStats')
      .orderBy('startDate')
      .get()
      .then(function (snapshot) {
        var tmp = []
        snapshot.forEach(function (doc) {
          if (doc.exists) {
            var item = doc.data()
            tmp.push(item)
          }
        })
        return tmp
      })
  },
  getPickPercent (matchId) {
    logger.logIt('Getting stats for match: ' + matchId)
    return db.collection('pickStats').doc(matchId)
      .get()
      .then(function (snapshot) {
        if (snapshot.exists) return snapshot.data()
        else return false
      })
  }
}
