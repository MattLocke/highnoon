import firebase from 'firebase/app'
import 'firebase/firestore'
import { fireInit } from '@/fireLogin'
import moment from 'moment-timezone'

fireInit()

var db = firebase.firestore()

export default {
  logIt (message) {
    // console.log(message)
  },
  errorIt (message) {
    console.error(message)
  },
  dbLog (logType, message) {
    const today = new Date()
    const dateTime = moment(today).format('YYYYMMDD')
    return db.collection('logs').doc(logType).collection(dateTime).add({ message })
  }
}
