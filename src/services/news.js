import firebase from 'firebase'
import {fireInit} from '@/helpers/firebase-helper'
import logger from '@/services/logger'

fireInit()
require('firebase/firestore')

var db = firebase.firestore()

export default {
  updateNews (news) {
    return db.collection('news').doc(news.id)
      .update(news)
      .then(function (newsRef) {
        return true
      })
  },
  getNews () {
    logger.logIt('Getting news.')
    return db.collection('news')
      .orderBy('postDate', 'desc')
      .limit(10)
      .get()
      .then(function (snapshot) {
        var tmp = []
        snapshot.forEach(function (doc) {
          if (doc.exists) {
            var item = doc.data()
            item.id = doc.id
            tmp.push(item)
          }
        })
        return tmp
      })
  },
  addNews (news) {
    return db.collection('news').add(news)
      .then(function (newsRef) {
        return newsRef.id
      }).catch(function (error) {
        logger.errorIt(error)
        return false
      })
  },
  getArticle (articleId) {
    logger.logIt('Getting article with id of: ' + articleId)
    return db.collection('news')
      .doc(articleId)
      .get()
      .then(function (article) {
        if (article.exists) return article.data()
        else return false
      })
  },
  getHomeNews () {
    logger.logIt('Getting home page news.')
    return db.collection('news')
      .where('frontPage', '==', true)
      .where('approved', '==', true)
      .orderBy('postDate', 'desc')
      .limit(1)
      .get()
      .then(function (snapshot) {
        var tmp = []
        snapshot.forEach(function (doc) {
          if (doc.exists) {
            var item = doc.data()
            item.id = doc.id
            tmp.push(item)
          }
        })
        return tmp[0]
      })
  }
}
