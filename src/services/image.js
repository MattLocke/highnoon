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
  getImageListings (folder) {
    var db = firebase.firestore()
    return db.collection('images').doc(folder)
      .get()
      .then(images => images.data())
  },
  uploadImage (folder, imageName, image) {
    var uploadPath = `images/${folder}/${imageName}`
    var imageRef = firebase.storage().ref().child(uploadPath)

    var uploadTask = imageRef.put(image)
    uploadTask.on('state_changed', (snapshot) => {
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      console.log(`Upload is ${progress}% done`)
    }, (error) => {
      console.error(error)
    }, () => {
      logger.logIt('Successfully uploaded the image!')
      var db = firebase.firestore()
      var currentTime = Date.now()
      uploadTask.snapshot.ref.getDownloadURL()
        .then((downloadURL) => {
          return db.collection('images').doc(folder).set({ [currentTime]: { imageName, currentTime, downloadURL } }, { merge: true })
        })
        .then(() => {
          window.location.reload()
        })
    })
  }
}
