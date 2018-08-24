import firebase from 'firebase'
import {fireInit} from '@/helpers/firebase-helper'
import logger from '@/services/logger'
import router from 'vue-router'

fireInit()
require('firebase/firestore')

var db = firebase.firestore()

export default {
  createMultiplePicks (picks) {
    var batch = db.batch()
    picks.forEach(function (pick) {
      // batch wasn't working here.  I hate this line.
      var snapRef = db.collection('matchPicks').doc()
      batch.set(snapRef, pick)
    })
    batch.commit().then(function () {
      logger.logIt('Ran the batch commit.')
      router.go(router.currentRoute)
      window.location.reload(true) // this is for mac idiots only.
    })
  },
  createPick (data, applyToAll) {
    return db.collection('matchPicks').add(data)
      .then(function (pickRef) {
      // if we're applying to all - we need to iterate through all of them here and set it to the data.
        logger.logIt('Creating pick.  Apply all is: ' + applyToAll)
        if (applyToAll) {
          var batch = db.batch()
          // first we need to delete all the ones they've already made
          logger.logIt('Deleting leagues matching user: ' + data.userId + ' and match: ' + data.matchId)
          return db.collection('matchPicks')
            .where('userId', '==', data.userId)
            .where('matchId', '==', data.matchId)
            .get()
            .then(function (pickSnapshot) {
              pickSnapshot.forEach(function (snap) {
                var snapRef = db.collection('matchPicks').doc(snap.id)
                batch.delete(snapRef)
              })
              return db.collection('leagueUsers')
                .where('userId', '==', data.userId)
                .where('active', '==', true)
                .get()
                .then(function (snapshot) {
                // now we need to build an object based on each league.
                  snapshot.forEach(function (doc) {
                    var tmp = doc.data()
                    var pick = data
                    pick.leagueId = tmp.leagueId
                    var tmpRef = db.collection('matchPicks').doc()
                    batch.set(tmpRef, pick)
                  })
                  batch.commit().then(function () {
                    return true
                  })
                })
            })
        } else return pickRef.id
      }).catch(function (error) {
        logger.errorIt(error)
        return false
      })
  },
  checkExisting (data) {
    // check to see if they have a pick for this match, if they do - return true.
    // console.table(data)
    return db.collection('matchPicks')
      .where('userId', '==', data.userId)
      .where('matchId', '==', data.matchId)
      .where('leagueId', '==', data.leagueId)
      .get()
      .then(function (snapshot) {
        var exists = false
        snapshot.forEach(function (doc) {
          if (doc.exists) exists = doc.id
        })
        return exists
      }).catch(function (error) {
        logger.errorIt(error)
        return false
      })
  },
  getPicks (userId, leagueId, stage) {
    return db.collection('matchPicks')
      .where('userId', '==', userId)
      .where('leagueId', '==', leagueId)
      .where('stage', '==', stage)
      .orderBy('startDate')
      .get()
      .then(function (snapshot) {
        var tmp = []
        snapshot.forEach(function (doc) {
          if (doc.exists) tmp.push(doc.data())
        })
        return tmp
      })
  },
  getPicksForMatch (matchId) {
    return db.collection('matchPicks')
      .where('matchId', '==', matchId)
      .get()
      .then(function (snapshot) {
        var tmp = []
        snapshot.forEach(function (doc) {
          if (doc.exists) tmp.push(doc.data())
        })
        return tmp
      })
  },
  getPicksForLeague (leagueId, matchId) {
    return db.collection('matchPicks')
      .where('matchId', '==', matchId)
      .where('leagueId', '==', leagueId)
      .get()
      .then(function (snapshot) {
        var tmp = []
        snapshot.forEach(function (doc) {
          if (doc.exists) tmp.push(doc.data())
        })
        return tmp
      })
  },
  getPicksForMatchByUser (matchId, userId, leagueId) {
    return db.collection('matchPicks')
      .where('matchId', '==', matchId)
      .where('userId', '==', userId)
      .where('leagueId', '==', leagueId)
      .get()
      .then(function (snapshot) {
        var tmp = []
        snapshot.forEach(function (doc) {
          if (doc.exists) tmp.push(doc.data())
        })
        return tmp
      })
  },
  getPickById (pickId) {
    return db.collection('matchPicks')
      .doc(pickId)
      .get()
      .then(function (pick) {
        if (pick.exists) {
          return pick.data()
        } else return false
      }).catch(function (error) {
        logger.errorIt(error)
      })
  },
  deletePicks (leagueId, userId) {
    var batch = db.batch()
    return db.collection('matchPicks')
      .where('userId', '==', userId)
      .where('leagueId', '==', leagueId)
      .get()
      .then(function (snapshot) {
        if (snapshot) {
          snapshot.forEach(function (snap) {
            var snapRef = db.collection('matchPicks').doc(snap.id)
            batch.delete(snapRef)
          })
          batch.commit().then(function () {
            return true
          })
        } else return true
      }, function () {
        return true
      })
  },
  updatePick (pickData, pickId, applyToAll) {
    return db.collection('matchPicks').doc(pickId)
      .update(pickData)
      .then(function () {
      // if we're applying to all, time to iterate
        if (applyToAll) {
          var batch = db.batch()
          // first we need to delete all the ones they've already made
          logger.logIt('Deleting leagues matching user: ' + pickData.userId + ' and match: ' + pickData.matchId)
          return db.collection('matchPicks')
            .where('userId', '==', pickData.userId)
            .where('matchId', '==', pickData.matchId)
            .get()
            .then(function (pickSnapshot) {
              pickSnapshot.forEach(function (snap) {
                var snapRef = db.collection('matchPicks').doc(snap.id)
                batch.delete(snapRef)
              })
              return db.collection('leagueUsers')
                .where('userId', '==', pickData.userId)
                .where('active', '==', true)
                .get()
                .then(function (snapshot) {
                // now we need to build an object based on each league.
                  snapshot.forEach(function (doc) {
                    var tmp = doc.data()
                    var pick = pickData
                    pick.leagueId = tmp.leagueId
                    var tmpRef = db.collection('matchPicks').doc()
                    batch.set(tmpRef, pick)
                  })
                  batch.commit().then(function () {
                    return true
                  })
                })
            })
        } else return true
      })
      .catch(function (error) {
        logger.errorIt(error)
        return false
      })
  }
}
