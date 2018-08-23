import firebase from 'firebase'
import {fireInit} from '@/helpers/firebase-helper'
import logger from '@/services/logger'
import fireImage from '@/services/image'

fireInit()
require('firebase/firestore')

var db = firebase.firestore()

export default {
  getCompetitions () {
    logger.logIt('Getting competitions.')
    var tmpReturn = []
    return db.collection('competitions')
    .where('isActive', '==', true)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        var tmpObj = doc.data()
        tmpObj.id = doc.id
        return fireImage.getCompetitionLogo(tmpObj.image).then(function (url) {
          tmpObj.fireImage = url
          tmpReturn.push(tmpObj)
        })
      })
      return tmpReturn
    }, function (error) {
      logger.errorIt(error)
    })
  },
  getOldCompetitions () {
    logger.logIt('Getting competitions.')
    var tmpReturn = []
    return db.collection('competitions')
    .where('isActive', '==', false)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        var tmpObj = doc.data()
        tmpObj.id = doc.id
        return fireImage.getCompetitionLogo(tmpObj.image).then(function (url) {
          tmpObj.fireImage = url
          tmpReturn.push(tmpObj)
        })
      })
      return tmpReturn
    }, function (error) {
      logger.errorIt(error)
    })
  },
  getLeaderboards (compId) {
    logger.logIt('Getting leaderboards for: ' + compId)
    var tmpReturn = []
    return db.collection('compLeaderboard/' + compId)
    .orderBy('points')
    .limit(100)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        var tmpObj = doc.data()
        tmpReturn.push(tmpObj)
      })
    })
  }
}
