import firebase from 'firebase'
import {fireInit} from '@/helpers/firebase-helper'
import logger from '@/services/logger'

fireInit()
require('firebase/firestore')

var db = firebase.firestore()

/*
  message {
    userId
    userDisplayName
    userAvatar
    leagueId
    message
    dateCreated
  }
*/

export default {
  createMessage (meta, payload) {
    return db.collection('messages').add(payload)
      .then(function (messageRef) {
      // need to set a record we'll use to verify picks.
        meta.conversationId = messageRef
        return db.collection('messageList').doc(meta.yourId).collection(meta.theirId).add(meta).then(function (ref) {
          logger.logIt(ref)
          return db.collection('messageList').doc(meta.theirId).collection(meta.yourId).add(meta).then(function (ref2) {
            logger.logIt(ref2)
            return true
          })
        })
      }).catch(function (error) {
        logger.errorIt(error)
        return false
      })
  },
  getMessages (yourId, theirId) {
    logger.logIt('Getting messages for user: ' + yourId)
    var tmpReturn = []
    var tmpSnap = {}
    return db.collection('messages')
      .doc(yourId)
      .collection(theirId)
      .orderBy('messageDate', 'desc')
      .limit(25)
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
  getMessageList (yourId) {

  },
  deleteMessage (messageId) {
    return db.collection('messages').doc(messageId).delete().then(function () {
      return true
    })
  }
}
