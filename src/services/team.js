import firebase from 'firebase'
import {fireInit} from '@/helpers/firebase-helper'
import logger from '@/services/logger'

fireInit()
require('firebase/firestore')

var db = firebase.firestore()

export default {
  createTeam (data) {
    return db.collection('teams').add(data)
      .then(function (teamRef) {
        return teamRef.id
      })
  },
  getTeams (compId) {
    logger.logIt('Getting teams for comp with id: ' + compId)
    var tmpReturn = []
    var tmpSnap = {}
    return db.collection('teams')
      .where('compId', '==', compId)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          tmpSnap = doc.data()
          tmpSnap.id = doc.id
          tmpReturn.push(tmpSnap)
        })
        return tmpReturn
      }, function (error) {
        logger.errorIt(error)
      })
  },
  getTeamById (teamId) {
    logger.logIt('Getting team with id of: ' + teamId)
    return db.collection('teams')
      .doc(teamId)
      .get()
      .then(function (team) {
        if (team.exists) return team.data()
        else return false
      })
  },
  getAllTeams () {
    var tmpReturn = []
    var tmpSnap = {}
    return db.collection('allTeams')
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          tmpSnap = doc.data()
          tmpSnap.id = doc.id
          tmpReturn.push(tmpSnap)
        })
        return tmpReturn
      }, function (error) {
        logger.errorIt(error)
      })
  },
  updateRoster (teamId, roster) {
    return db.collection('teams').doc(teamId)
      .update({roster: roster})
      .then(function () {
        return true
      })
  },
  updateWinLoss (teamId, wins, losses) {
    return db.collection('teams').doc(teamId)
      .update({wins: wins, losses: losses})
      .then(function () {
        return true
      })
  }
}
