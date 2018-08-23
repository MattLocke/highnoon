import firebase from 'firebase'
import {fireInit} from '@/helpers/firebase-helper'
import logger from '@/services/logger'

fireInit()
require('firebase/firestore')

var db = firebase.firestore()

/*
  comment {
    userId
    userDisplayName
    userAvatar
    leagueId
    message
    dateCreated
  }
*/

export default {
  createComment (payload) {
    return db.collection('comments').add(payload)
    .then(function (commentRef) {
      // need to set a record we'll use to verify picks.
      return commentRef.id
    }).catch(function (error) {
      logger.errorIt(error)
      return false
    })
  },
  createArticleComment (payload) {
    return db.collection('articleComments').add(payload)
    .then(function (commentRef) {
      // need to set a record we'll use to verify picks.
      return commentRef.id
    }).catch(function (error) {
      logger.errorIt(error)
      return false
    })
  },
  getComments (leagueId) {
    logger.logIt('Getting comments for league with id: ' + leagueId)
    var tmpReturn = []
    var tmpSnap = {}
    return db.collection('comments')
    .where('leagueId', '==', leagueId)
    .orderBy('postDate', 'desc')
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
  getArticleComments (articleId) {
    logger.logIt('Getting comments for league with id: ' + articleId)
    var tmpReturn = []
    var tmpSnap = {}
    return db.collection('articleComments')
    .where('articleId', '==', articleId)
    .orderBy('postDate', 'desc')
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
  deleteComment (commentId) {
    return db.collection('comments').doc(commentId).delete().then(function () {
      return true
    })
  },
  deleteArticleComment (commentId) {
    return db.collection('articleComments').doc(commentId).delete().then(function () {
      return true
    })
  }
}
