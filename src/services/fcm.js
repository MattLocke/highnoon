import firebase from 'firebase'
import { fireInit } from '@/helpers/firebase-helper'
import runtime from 'serviceworker-webpack-plugin/lib/runtime'

fireInit()
require('firebase/firestore')

const db = firebase.firestore()
const messaging = firebase.messaging()

function saveToken (userId, token) {
  return db.collection('pushTokens').doc(token)
    .set({token: token, userId: userId})
    .then(function () {
      return true
    }).catch(error => {
      console.log(error)
    })
}

export default {
  registerWorker (userId) {
    if ('serviceWorker' in navigator) {
      runtime.register().then(function (registration) {
        console.log('We have a service worker')
        // messaging.useServiceWorker(registration)
        messaging.requestPermission()
          .then(() => {
            messaging.useServiceWorker(registration)
            messaging.getToken().then(token => {
              console.log(`Saving token.`)
              // Store the token in the firebase db
              if (userId) {
                saveToken(userId, token).then(function (result) {
                  console.log(`Successfully saved the token.`)
                })
                  .catch(function (error) {
                    console.log(error)
                  })
              }
            })
          })
      }).catch(function (error) {
        console.log(error)
      })
    } else console.log('We could not register the service worker.')
  },
  requestPermission (userId) {
    messaging.requestPermission().then(function () {
      console.log('Notification permission granted.')
      // TODO(developer): Retrieve an Instance ID token for use with FCM.
      // ...
      return messaging.getToken()
    })
      .then(function (token) {
        console.log('FCM Token: ', token)
        saveToken(userId, token).then(function (result) {
          console.log(`Requested permission with success.`)
        })
          .catch(function (error) {
            console.log(error)
          })
      })
      .catch(function (err) {
        console.log('Unable to get permission to notify.', err)
      })
  },
  getToken (userId) {
    messaging.getToken().then(function (currentToken) {
      if (currentToken) {
        // sendTokenToServer(currentToken)
        saveToken(userId, currentToken).then(function (result) {
          console.log(`Able to grab token.`)
        })
          .catch(function (error) {
            console.log(error)
          })
        // updateUIForPushEnabled(currentToken)
      } else {
        // Show permission request.
        console.log('No Instance ID token available. Request permission to generate one.')
        // Show permission UI.
        // updateUIForPushPermissionRequired()
        // setTokenSentToServer(false)
      }
    }).catch(function (err) {
      console.log('An error occurred while retrieving token. ', err)
      // showToken('Error retrieving Instance ID token. ', err)
      // setTokenSentToServer(false)
    })
  }
}
// messaging.usePublicVapidKey('BLGETU7SeP9Onc4uJ4S_VQ5cb6QVVvaISbEantCfpa1SlOC1lvgKVZKCtF_NfeeYZporfAw5PbSiqB1nhucgM-Y')
