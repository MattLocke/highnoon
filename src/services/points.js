import firebase from 'firebase'
import {fireInit} from '@/helpers/firebase-helper'

fireInit()
require('firebase/firestore')

var db = firebase.firestore()

export default {
  assignPoints (matchId) {
    var matchPoints = {
      'winner': 400,
      'score': 100,
      'mapWinner': 100
    }

    var matchRef = db.collection('matches')

    console.log('Assigning points for match: ', matchId)
    // get the league information - so we know if it's simple.
    // TODO: beta - change this so it's actually on the match.
    // get the match Info, and set it as the truth data
    return matchRef.doc(matchId).get()
      .then(snapshot => {
        if (snapshot.exists) {
          var truthData = snapshot.data()
          // get all of the matchPicks that have that matchId
          return db.collection('matchPicks').where('matchId', '==', matchId).get()
            .then(snapshotb => {
              // go through each matchPick
              console.log('Iterating through match picks... ')
              snapshotb.forEach(matchPick => {
                // figure out how many points the pick is worth.
                var pick = matchPick.data()
                return db.collection('leagues').doc(pick.leagueId).get()
                  .then(leagueSnapshot => {
                    if (leagueSnapshot.exists) {
                      var leagueData = leagueSnapshot.data().data
                      var totalPoints = 0

                      if (pick.winner === truthData.matchWinner) totalPoints += matchPoints.winner
                      if (pick.score === truthData.matchScore) totalPoints += matchPoints.score
                      if (!leagueData.simpleMode) {
                        pick.maps.forEach(function (mapPick, index) {
                          if (mapPick.winner === truthData.maps[index].winner) totalPoints += matchPoints.mapWinner
                        })
                      }
                      console.log('Pick:', matchPick.id, ' Points: ', totalPoints)
                      // set the points on each matchPick
                      return db.collection('matchPicks').doc(matchPick.id).update({ points: totalPoints }).then(response => {
                        // set the points on that leagueUser
                        return db.collection('leagueUsers').where('leagueId', '==', pick.leagueId).where('userId', '==', pick.userId).get()
                          .then(snapshotc => {
                            snapshotc.forEach(leagueUserData => {
                              var tmp = leagueUserData.data()
                              var oldPoints = tmp.points
                              var newPoints = oldPoints + totalPoints
                              db.collection('leagueUsers').doc(leagueUserData.id).update({ points: newPoints }).then(response => {
                                return true
                              })
                            })
                          })
                      })
                    }
                  })
              })
            })
        } else {
          console.log('No match found with that Id!')
        }
      })
  }
}
