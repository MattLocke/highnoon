import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/firestore'
import { fireInit } from '@/fireLogin'

fireInit()

var db = firebase.firestore()
var rdb = firebase.database()

export default {
  canSave (pick) {
    return rdb.ref(`processedMatches/${pick.matchId}`).once('value').then(snapshot => {
      if (snapshot.val()) return false
      return true
    })
  },
  getGlobalLeaderboards () {
    return db.collection('leaderboardPicks')
      .orderBy('points', 'desc')
      .get()
      .then((pickDocs) => {
        const leaders = []
        pickDocs.forEach((pickDoc) => {
          leaders.push(pickDoc.data())
        })
        return leaders
      })
  },
  getGlobalPickRates () {
    return db.collection('picksLean').get()
      .then((pickDocs) => {
        const pickStats = {}
        pickDocs.forEach((pickDoc) => {
          const pick = pickDoc.data()
          pickStats[pickDoc.id] = pick
        })
        return pickStats
      })
  },
  getUserPickTotals () {
    return db.collection('userPickTotals').get()
      .then((pointDocs) => {
        const pointStats = {}
        pointDocs.forEach((pointDoc) => {
          const points = pointDoc.data()
          pointStats[pointDoc.id] = points
        })
        console.log('Built out point stats.')
        return pointStats
      })
  },
  savePick (pick) {
    return db.collection('matchPicks').doc(`${pick.userId}-${pick.matchId}`)
      .set({ ...pick }, { merge: true })
      .then(pickRef => pickRef.id)
      .catch((error) => {
        console.error(error)
        return false
      })
  }
}
