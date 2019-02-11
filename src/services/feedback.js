import firebase from 'firebase/app'
import 'firebase/firestore'
import { fireInit } from '@/fireLogin'

fireInit()

var db = firebase.firestore()

export default {
  sendFeedback (feedback) {
    return db.collection('feedback').add(feedback)
      .then(feedbackRef => feedbackRef.id)
      .catch((error) => {
        console.error(error)
        return false
      })
  }
}
