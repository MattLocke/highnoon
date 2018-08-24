import firebase from 'firebase'
import {fireInit} from '@/helpers/firebase-helper'
import logger from '@/services/logger'

fireInit()

export default {
  getTeamLogo (logo) {
    var storage = firebase.storage()
    var pathReference = storage.ref('images/team/' + logo)

    return pathReference.getDownloadURL().then(function (url) {
      return url
    }).catch(function (error) {
      // Return a default one we have for teams - not made yet!
      logger.errorIt(error)
      return false
    })
  },
  getLocalTeamLogo (logo) {
    return '/assets/img/team-logos/' + logo
  },
  getCompetitionLogo (logo) {
    var storage = firebase.storage()
    var pathReference = storage.ref('images/competitions/' + logo)

    return pathReference.getDownloadURL().then(function (url) {
      return url
    }).catch(function (error) {
      // Return a default one we have for teams - not made yet!
      logger.errorIt(error)
      return false
    })
  },
  getImage (folder, imageName) {
    var storage = firebase.storage()
    var pathReference = storage.ref('images/' + folder + '/' + imageName)

    return pathReference.getDownloadURL().then(function (url) {
      return url
    }).catch(function (error) {
      // Return a default one we have for teams - not made yet!
      logger.errorIt(error)
      return false
    })
  },
  uploadImage (folder, imageName, image) {
    var storageRef = firebase.storage().ref()
    var uploadPath = 'images/' + folder + '/' + imageName
    var imageRef = storageRef.child(uploadPath)
    return imageRef.put(image).then(function (snapshot) {
      logger.logIt('Successfully uploaded the image! ', snapshot)
      return true
    })
  }
}
