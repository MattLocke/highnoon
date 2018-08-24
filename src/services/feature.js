import firebase from 'firebase'
import {fireInit} from '@/helpers/firebase-helper'
import logger from '@/services/logger'

fireInit()
require('firebase/firestore')

var db = firebase.firestore()

export default {
  createFeature (payload) {
    logger.logIt('Creating feature...')
    return db.collection('features').add(payload)
      .then(function (featureRef) {
      // need to send back an ID for an immediate delete option.
        return featureRef.id
      }).catch(function (error) {
        logger.errorIt(error)
        return false
      })
  },
  getFeatures () {
    logger.logIt('Getting features...')
    var tmpReturn = []
    var tmpSnap = {}
    return db.collection('features')
      .orderBy('leagueName')
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
  deleteFeature (featureId) {
    return db.collection('features').doc(featureId).delete().then(function () {
      return true
    })
  }
}
