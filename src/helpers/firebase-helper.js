import firebase from 'firebase'

export function fireInit () {
  var config = {
    apiKey: 'AIzaSyA50FsH7M9A9QiUjOBRGPPx72jgUmvNzQg',
    authDomain: 'overwatch-pickem-dev.firebaseapp.com',
    databaseURL: 'https://overwatch-pickem-dev.firebaseio.com',
    projectId: 'overwatch-pickem-dev',
    storageBucket: 'overwatch-pickem-dev.appspot.com',
    messagingSenderId: '740785533903'
  }

  if (!firebase.apps.length) {
    firebase.initializeApp(config)
  }
}
