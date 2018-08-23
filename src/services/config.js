import firebase from 'firebase'
import {fireInit} from '@/helpers/firebase-helper'
import logger from '@/services/logger'

fireInit()
require('firebase/firestore')

var db = firebase.firestore()

export default {
  getConfig (configName) {
    logger.logIt('Getting config for: ' + configName)
    return db.collection('config')
      .doc(configName)
      .get()
      .then(function (config) {
        if (config.exists) return config.data()
        else return false
      })
  }
}
