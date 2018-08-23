import firebase from 'firebase'
import {fireInit} from '@/helpers/firebase-helper'

fireInit()

var db = firebase.database()

export default {
  sendMessage (leagueId, userId, messageData) {
    var newPostKey = db.ref().child('streamChats').push().key
    var updates = {}
    updates['/streamChats/' + leagueId + '/' + newPostKey] = messageData
    updates['/userChats/' + userId + '/' + newPostKey] = messageData

    return db.ref().update(updates)
  }
}
