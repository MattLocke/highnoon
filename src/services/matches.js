import firebase from 'firebase/app'
import 'firebase/firestore'
import { fireInit } from '@/fireLogin'
import logger from '@/services/logger'

fireInit()

var db = firebase.firestore()
db.settings({ timestampsInSnapshots: true })

export default {
  getAllMatches () {
    logger.logIt('Getting all matches.')
    return db.collection('matches')
      .orderBy('id', 'asc')
      .get()
      .then(matches => matches.docs.map(match => match.data()))
  }
}
