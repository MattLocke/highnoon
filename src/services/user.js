import firebase from 'firebase'
import {fireInit} from '@/helpers/firebase-helper'
import logger from '@/services/logger'

require('firebase/firestore')
fireInit()
var db = firebase.firestore()

export default {
  // Tons of "CRUD" here
  createProfile (data) {
    return db.collection('users')
    .doc(data.id)
    .set(data)
    .then(function (userRef) {
      logger.logIt('User created with id: ', data.id)
      return userRef
    })
    .catch(function (error) {
      logger.errorIt('Error adding user: ', error)
      return false
    })
  },
  getProfile (userId) {
    logger.logIt('Getting user with id of: ' + userId)
    return db.collection('users')
      .doc(userId)
      .get()
      .then(function (user) {
        if (user.exists) return user.data()
        else return false
      })
  },
  setLastActive (userId) {
    var timestamp = Math.round((parseInt(new Date().getTime())) / 1000)
    return db.collection('users').doc(userId)
    .update({lastActive: timestamp})
    .then(function () {
      return true
    })
  },
  updateProfile (userData, userId) {
    return db.collection('users').doc(userId)
    .update(userData)
    .then(function () {
      return true
    })
    .catch(function (error) {
      logger.errorIt(error)
      return false
    })
  },
  getAllUsers () {
    var theList = []
    return db.collection('users')
    .get()
    .then(function (users) {
      users.forEach(function (user) {
        var tmp = user.data()
        theList.push(tmp)
      })
      return theList
    })
  },
  deleteProfile (data) {

  },
  lockProfile (data) {

  }
}
