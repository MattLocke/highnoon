import firebase from 'firebase/app'

export function fireInit () {
  /* prod */
  // var config = {
  //   apiKey: 'AIzaSyCfsM2RsFally3Uu0NDwupjYJXJBkflEl0',
  //   authDomain: 'overwatch-pickem.firebaseapp.com',
  //   databaseURL: 'https://overwatch-pickem.firebaseio.com',
  //   projectId: 'overwatch-pickem',
  //   storageBucket: 'overwatch-pickem.appspot.com',
  //   messagingSenderId: '155288469362'
  // }

  /* dev */
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
