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
  getRosterScores (week, totalMode = false) {
    return db.collection(`player${totalMode ? 'Total' : 'Best'}Scores`)
      .doc(`${week}`)
      .get()
      .then((players) => players.data())
  },
  getRosterTotals (leagueId, week) {
    return db.collection('standardRostersFlat').where('leagueId', '==', leagueId).where('week', '==', Number(week)).get()
      .then(docs => {
        const matchupMap = {}
        docs.forEach(doc => {
          const roster = doc.data()
          matchupMap[roster.userId] = { ...roster, bestScore: Math.round(Number(roster.bestScore || 0)), totalScore: Math.round(Number(roster.totalScore || 0)) }
          console.table(matchupMap[roster.userId])
        })
        return matchupMap
      })
  },
  getUnlimitedRosterTotals (leagueId, week) {
    return db.collection('unlimitedWeeklyTotals').doc(leagueId).collection(`week${week}`).doc('rosters').get()
      .then(doc => doc.data())
  }
}
