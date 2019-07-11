import firebase from 'firebase/app'
import 'firebase/firestore'
import { fireInit } from '@/fireLogin'

fireInit()

var db = firebase.firestore()

export default {
  listByLeague (leagueId) {
    return db.collection('audits').where('leagueId', '==', leagueId).orderBy('when', 'desc').get().then(auditDocs => auditDocs.docs.map(a => a.data()))
  },
  record (userId, displayName, leagueId, message) {
    const when = Date.now()
    const auditObj = {
      userId,
      displayName,
      leagueId,
      message,
      when
    }
    return db.collection('audits').doc(`${leagueId}-${when}`).set(auditObj)
  }
}
