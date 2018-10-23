import firebase from 'firebase/app'
import 'firebase/firestore'
import { fireInit } from '@/fireLogin'
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
    return db.collection('news')
      .orderBy('postDate', 'desc')
      .limit(10)
      .get()
      .then(articles => articles.docs.map(article => article.data()))
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
  },
  getHomeNews () {
    logger.logIt('Getting home page news.')
    return db.collection('news')
      .where('frontPage', '==', true)
      .where('approved', '==', true)
      .orderBy('postDate', 'desc')
      .limit(1)
      .get()
      .then(article => article.docs.map(a => ({ ...a.id, ...a.data() }))[0])
  }
}
