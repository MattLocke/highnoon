import firebase from 'firebase/app'
import 'firebase/firestore'
import { fireInit } from '@/fireLogin'
import logger from '@/services/logger'

fireInit()

var db = firebase.firestore()
db.settings({ timestampsInSnapshots: true })

export default {
  getAllTeams () {
    logger.logIt('Getting all teams.')
    return db.collection('teams')
      .orderBy('name', 'asc')
      .get()
      .then(teams => teams.docs.map(team => team.data()))
  }
}
