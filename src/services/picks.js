import firebase from 'firebase/app'
import 'firebase/firestore'
import { fireInit } from '@/fireLogin'

fireInit()

var db = firebase.firestore()
db.settings({ timestampsInSnapshots: true })

export default {
  savePick (pick) {
    return db.collection('picks').doc(String(pick.userId))
      .set({ [pick.matchId]: pick }, { merge: true })
      .then(pickRef => pickRef.id)
      .catch((error) => {
        console.error(error)
        return false
      })
  }
}
