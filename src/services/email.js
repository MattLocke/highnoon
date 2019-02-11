import firebase from 'firebase/app'
import 'firebase/database'
import { fireInit } from '@/fireLogin'

fireInit()

var db = firebase.database()

export default {
  sendEmail (email) {
    /*
    Needs:
    -to
    -subject
    -textBody
    */
    const emailData = {
      to: 'matt@highlevel.io',
      subject: 'No Subject Entered',
      textBody: 'Someone did not populate the body of this email...',
      ...email
    }

    return db.ref('/email').push(emailData)
  }
}
