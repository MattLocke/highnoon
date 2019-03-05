import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/database'
import { fireInit } from '@/fireLogin'

fireInit()

var db = firebase.firestore()

export default {
  getRosterByWeek (leagueId, week, userId) {
    return db.collection('unlimitedWeeklyTotals').doc(leagueId).collection(`week${week}`).doc('rosters').get()
      .then((rostersDoc) => {
        const theRosters = rostersDoc.data()
        return theRosters[userId].roster || {}
      })
      .catch(e => Promise.reject(e))
  },
  getRosterScores (week) {
    return db.collection(`playerBestScores`)
      .doc(`${week}`)
      .get()
      .then((players) => players.data())
  }
}
