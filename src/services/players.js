import firebase from 'firebase/app'
import 'firebase/firestore'
import { fireInit } from '@/fireLogin'
import logger from '@/services/logger'
import _ from 'lodash'

fireInit()

var db = firebase.firestore()

export default {
  getAllPlayers () {
    logger.logIt('Getting all players.')
    return db.collection('players')
      .orderBy('name', 'asc')
      .get()
      .then(players => players.docs.map(player => {
        const indexedPlayer = {}
        const p = player.data()
        indexedPlayer[p.id] = p
        return indexedPlayer
      }))
  },
  getPlayer (playerName) {
    logger.logIt(`Getting player with name: ${playerName}`)
    return db.collection('players')
      .doc(playerName)
      .get()
      .then(player => player.exists ? player.data() : null)
  },
  getPlayerBestScores (week) {
    return db.collection('playerBestScores').doc(week).get()
      .then(doc => {
        const bestMap = {}
        const scores = doc.data()
        _.forEach(scores, (score, playerId) => {
          bestMap[playerId] = score
        })
        return bestMap
      })
  },
  getPlayerTotalScores (week) {
    return db.collection('playerTotalScores').doc(week).get()
      .then(doc => {
        const totalMap = {}
        const scores = doc.data()
        _.forEach(scores, (score, playerId) => {
          totalMap[playerId] = score
        })
        return totalMap
      })
  },
  buildPlayerList (players, playerIds) {

  },
  buildAPlayer (players, playerId) {
    return players.find(player => Number(player.id) === Number(playerId))
  }
}
