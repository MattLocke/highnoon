import firebase from 'firebase'
import {fireInit} from '@/helpers/firebase-helper'
import logger from '@/services/logger'
import owlTeams from '@/data/owlTeams'

fireInit()
require('firebase/firestore')

var db = firebase.firestore()

export default {
  populateCompetition () {
    // creates a competition in the db for testing
    var compId = '6Ru4RC0lw5gopGPV7nRm'
    var compData = {
      description: 'Stage 1 of OWL (beta)',
      endDate: 20180210,
      image: 'overwatch-league.png',
      isActive: true,
      name: 'OWL Stage 1',
      numTeams: 12,
      organizer: 'Blizzard',
      type: 'LAN',
      winstonsId: 91
    }
    return db.collection('competitions')
    .doc(compId)
    .set(compData)
    .then(function (comp) {
      logger.logIt('Created competition with id: ', comp.id)
      return comp
    })
    .catch(function (error) {
      logger.errorIt('Error creating comp: ', error)
      return false
    })
  },
  populateTeams (compId) {
    // Adds teams from OWL to a given competition
    var theTeams = owlTeams.owlTeams()
    theTeams.forEach(function (team) {
      team.compId = compId
      populateTeamInserter(team)
    })
  },
  populateGenericTeams () {
    var theTeams = owlTeams.owlTeams()
    theTeams.forEach(function (team) {
      db.collection('allTeams').add(team)
    })
  }
}

function populateTeamInserter (team) {
  return db.collection('teams').add(team).then(function () {
    return true
  })
}
