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
      .then(players => players.docs.map(player => player.data()))
  },
  getPlayer (playerName) {
    logger.logIt(`Getting player with name: ${playerName}`)
    return db.collection('players')
      .doc(playerName)
      .get()
      .then(player => player.exists ? player.data() : null)
  }
}
