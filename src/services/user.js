import firebase from 'firebase/app'
import 'firebase/firestore'
import { fireInit } from '@/fireLogin'
import logger from '@/services/logger'

fireInit()
var db = firebase.firestore()

export default {
  createProfile (data) {
    return db.collection('users')
    .doc(data.id)
    .set(data)
    .then(userRef => userRef)
    .catch((error) => {
      logger.errorIt(`Error adding user: ${error}`)
      return false
    })
  },
  getProfile (userId) {
    logger.logIt('Getting user with id of: ' + userId)
    return db.collection('users')
      .doc(userId)
      .get()
      .then((user) => {
        if (user.exists) return user.data()
        return false
      })
  },
  setLastActive (userId) {
    var timestamp = Math.round((parseInt(new Date().getTime())) / 1000)
    return db.collection('users').doc(userId)
    .update({lastActive: timestamp})
    .then(() => true)
  },
  updateProfile (userData, userId) {
    return db.collection('users').doc(userId)
    .update(userData)
    .then(() => true)
    .catch((error) => {
      logger.errorIt(error)
      return false
    })
  },
  getAllUsers () {
    var theList = []
    return db.collection('users')
    .get()
    .then((users) => users.docs.map(user => user.data()))
  }
}
