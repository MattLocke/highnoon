import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
import { fireInit } from '@/fireLogin'
import logger from '@/services/logger'

fireInit()

export default {
  getTeamLogo (logo) {
    var pathReference = firebase.storage().ref(`images/team/${logo}`)

    return pathReference.getDownloadURL()
      .then(url => url)
      .catch((error) => {
        logger.errorIt(error)
        return false
      })
  },
  getLocalTeamLogo (logo) {
    return `/static/img/team-logos/${logo}`
  },
  getCompetitionLogo (logo) {
    var pathReference = firebase.storage().ref(`images/competitions/${logo}`)

    return pathReference.getDownloadURL()
      .then(url => url)
      .catch((error) => {
        logger.errorIt(error)
        return false
      })
  },
  getImage (folder, imageName) {
    var pathReference = firebase.storage().ref(`images/${folder}/${imageName}`)

    return pathReference.getDownloadURL()
      .then(url => url)
      .catch((error) => {
        // Return a default one we have for teams - not made yet!
        logger.errorIt(error)
        return false
      })
  },
  uploadImage (folder, imageName, image) {
    var uploadPath = `images/${folder}/${imageName}`
    var imageRef = firebase.storage().ref().child(uploadPath)

    return imageRef.put(image)
      .then((snapshot) => {
        logger.logIt('Successfully uploaded the image! ', snapshot)
        return true
      })
      .catch((error) => {
        logger.errorIt(error)
        return false
      })
  }
}
