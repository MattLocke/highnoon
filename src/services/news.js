import firebase from 'firebase/app'
import 'firebase/firestore'
import { fireInit } from '@/fireLogin'
import moment from 'moment-timezone'
import logger from '@/services/logger'

fireInit()

var db = firebase.firestore()
db.settings({ timestampsInSnapshots: true })

export default {
  updateNews (news) {
    return db.collection('news').doc(news.id)
      .update(news)
      .then(() => true)
  },
  getNews () {
    logger.logIt('Getting news.')
    const now = Number(moment().format('X'))
    return db.collection('news')
      .where('approved', '==', true)
      .where('postDate', '<', now)
      .orderBy('postDate', 'desc')
      .limit(10)
      .get()
      .then(articles => articles.docs.map(article => ({ id: article.id, ...article.data() })))
  },
  getPendingNews () {
    logger.logIt('Getting pending news.')
    return db.collection('news')
      .where('approved', '==', false)
      .orderBy('postDate', 'desc')
      .limit(10)
      .get()
      .then(articles => articles.docs.map(article => ({ id:article.id, ...article.data() })))
  },
  addNews (news) {
    return db.collection('news').add(news)
      .then(newsRef => newsRef.id)
      .catch((error) => {
        logger.errorIt(error)
        return false
      })
  },
  getArticle (articleId) {
    logger.logIt('Getting article with id of: ' + articleId)
    return db.collection('news')
      .doc(articleId)
      .get()
      .then(article => article.exists ? article.data() : false)
  }
}
