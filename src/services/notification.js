import firebase from 'firebase'
import {fireInit} from '@/helpers/firebase-helper'
import logger from '@/services/logger'

fireInit()
require('@firebase/firestore')

var db = firebase.firestore()

export default {
  updateNotification (notification) {
    return db.collection('notification').doc(notification.id)
    .update(notification)
    .then(function (notificationRef) {
      return true
    })
  },
  getNotification (noteId) {
    logger.logIt('Getting notification.')
    return db.collection('notification')
      .doc(noteId)
      .get()
      .then(function (note) {
        if (note.exists) return note.data()
        else return false
      })
  },
  saveNotification (notification, noteId) {
    return db.collection('notification')
      .doc(noteId)
      .set(notification)
      .then(function () {
        return true
      })
  },
  addNotification (notification) {
    return db.collection('notification').add(notification)
    .then(function (notificationRef) {
      return notificationRef.id
    }).catch(function (error) {
      logger.errorIt(error)
      return false
    })
  }
}
