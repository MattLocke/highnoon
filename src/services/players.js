import firebase from 'firebase/app'
import 'firebase/firestore'
import { fireInit } from '@/fireLogin'
import logger from '@/services/logger'

fireInit()

var db = firebase.firestore()
db.settings({ timestampsInSnapshots: true })

export default {
  getAllPlayers () {
    logger.logIt('Getting all players.')
    return db.collection('players')
      .orderBy('name', 'asc')
      .get()
      .then(function (snapshot) {
        var tmp = []
        snapshot.forEach(function (doc) {
          if (doc.exists) {
            var item = doc.data()
            tmp.push(item)
          }
        })
        return tmp
      })
  }
}
