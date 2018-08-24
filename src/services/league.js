import firebase from 'firebase'
import {fireInit} from '@/helpers/firebase-helper'
// import router from 'vue-router'
import logger from '@/services/logger'

fireInit()
require('firebase/firestore')

var db = firebase.firestore()
// var _this = this

export default {
  createLeague (data, router) {
    db.collection('leagues').add({
      data
    })
      .then(function (docRef) {
        logger.logIt('League written with ID: ', docRef.id)
        data.leagueId = docRef.id
        var leagueData = {
          leagueId: docRef.id,
          leagueName: data.name,
          userId: data.ownerId,
          userDisplayName: data.ownerDisplayName,
          points: 0,
          active: true,
          simpleMode: data.simpleMode
        }
        db.collection('leagueUsers').add(
          leagueData
        ).then(function (docRef) {
          logger.logIt('Added user to league with id: ' + data.leagueId)
          router.push({path: '/ViewLeague/' + data.leagueId})
        })
      })
      .catch(function (error) {
        logger.errorIt('Error adding league: ', error)
      })
  },
  getLeaguesByUser (userId) {
    logger.logIt('Getting leagues for user with id: ' + userId)
    var tmpReturn = []
    return db.collection('leagueUsers')
      .where('userId', '==', userId)
      .where('active', '==', true)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          var tmpObj = doc.data()
          tmpObj.docId = doc.id
          tmpReturn.push(tmpObj)
        })
        return tmpReturn
      }, function (error) {
        logger.errorIt(error)
      })
  },
  getOldLeaguesByUser (userId) {
    logger.logIt('Getting old leagues for user with id: ' + userId)
    var tmpReturn = []
    return db.collection('leagueUsers')
      .where('userId', '==', userId)
      .where('active', '==', false)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          var tmpObj = doc.data()
          tmpObj.docId = doc.id
          tmpReturn.push(tmpObj)
        })
        return tmpReturn
      }, function (error) {
        logger.errorIt(error)
      })
  },
  getLeagueById (leagueId) {
    logger.logIt('Getting league with id of: ' + leagueId)
    return db.collection('leagues')
      .doc(leagueId)
      .get()
      .then(function (doc) {
        if (doc.exists) return doc.data()
        else return false
      })
  },
  getLeagueUser (leagueId, userId) {
    logger.logIt('Getting league with id of: ' + leagueId)
    var tmpReturn = []
    return db.collection('leagueUsers')
      .where('leagueId', '==', leagueId)
      .where('userId', '==', userId)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          var tmp = doc.data()
          tmp.id = doc.id
          tmpReturn.push(tmp)
        })
        return tmpReturn
      }, function (error) {
        logger.errorIt(error)
      })
  },
  getLeagueUsers (leagueId) {
    logger.logIt('Getting users for league with id: ' + leagueId)
    var tmpReturn = []
    return db.collection('leagueUsers')
      .where('leagueId', '==', leagueId)
      .orderBy('points', 'desc')
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          var tmp = doc.data()
          if (!tmp.stage1Points) tmp.stage1Points = 0
          if (!tmp.stage2Points) tmp.stage2Points = 0
          if (!tmp.stage3Points) tmp.stage3Points = 0
          tmpReturn.push(tmp)
        })
        return tmpReturn
      }, function (error) {
        logger.errorIt(error)
      })
  },
  unlockLeague (leagueId) {
    if (leagueId) {
      var leagueRef = db.collection('leagues').doc(leagueId)
      return leagueRef.set({ data: { isLocked: false } }, { merge: true }).then(function () {
        return true
      }).catch(function (error) {
        logger.errorIt(error)
        return false
      })
    }
  },
  lockLeague (leagueId) {
    if (leagueId) {
      var leagueRef = db.collection('leagues').doc(leagueId)
      return leagueRef.set({ data: { isLocked: true } }, { merge: true }).then(function () {
        return true
      }).catch(function (error) {
        logger.errorIt(error)
        return false
      })
    }
  },
  setMaxUsers (leagueId, numUsers) {
    if (leagueId) {
      var leagueRef = db.collection('leagues').doc(leagueId)
      return leagueRef.set({ data: { maxUsers: numUsers } }, { merge: true }).then(function () {
        return true
      }).catch(function (error) {
        logger.errorIt(error)
        return false
      })
    }
  },
  updateMotd (leagueId, motd) {
    if (leagueId) {
      var leagueRef = db.collection('leagues').doc(leagueId)
      return leagueRef.set({ data: { motd: motd } }, { merge: true }).then(function () {
        return true
      }).catch(function (error) {
        logger.errorIt(error)
        return false
      })
    }
  },
  joinLeague (leagueData) {
    // leagueUsers
    // leagueId, leagueName, userDisplayName, userId
    return db.collection('leagueUsers').add(
      leagueData
    ).then(function (docRef) {
      logger.logIt('Added user to league with id: ' + leagueData.leagueId)
      return true
    }).catch(function (error) {
      logger.errorIt('Error joining league: ' + error)
      return false
    })
  },
  leaveLeague (leagueId, userId, isLeaver, router) {
    // Where they can leave the league - gotta remove them, and all instances of their picks
    var batch = db.batch()

    db.collection('leagueUsers')
      .where('leagueId', '==', leagueId)
      .where('userId', '==', userId)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          batch.delete(db.collection('leagueUsers').doc(doc.id))
        })
        // now the picks
        db.collection('matchPicks')
          .where('leagueId', '==', leagueId)
          .where('userId', '==', userId)
          .get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              batch.delete(db.collection('leagueUsers').doc(doc.id))
            })
            batch.commit().then(function () {
              if (isLeaver) router.push({path: '/'})
              else location.reload()
            })
          })
      })
  },
  deleteLeague (leagueId, router) {
    var batch = db.batch()

    db.collection('leagueUsers')
      .where('leagueId', '==', leagueId)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          batch.delete(db.collection('leagueUsers').doc(doc.id))
        })
        // now the picks
        batch.delete(db.collection('leagues').doc(leagueId))
        batch.commit().then(function () {
          router.push({path: '/'})
        })
      })
  },
  toggleSimple (leagueId, simpleMode) {
    return db.collection('leagues').doc(leagueId)
      .update({
        'data.simpleMode': simpleMode
      })
      .then(function () {
        return true
      })
      .catch(function (error) {
        logger.errorIt(error)
        return false
      })
  },
  toggleLottery (leagueId, lotteryMode) {
    return db.collection('leagues').doc(leagueId)
      .update({
        'data.lotteryMode': lotteryMode
      })
      .then(function () {
        return true
      })
      .catch(function (error) {
        logger.errorIt(error)
        return false
      })
  },
  setMotd (leagueId, message) {
  },
  setLeaguePassword (leagueId, password) {
    var data = {'password': password}
    return db.collection('leaguePassword')
      .doc(leagueId)
      .set(data)
      .then(function (pwRef) {
        logger.logIt('Password set!')
        return true
      })
      .catch(function (error) {
        logger.errorIt('Error creating password. ', error)
        return false
      })
  },
  checkLeaguePassword (leagueId, password) {
    logger.logIt('Checking league password for league: ' + leagueId)
    return db.collection('leaguePassword')
      .doc(leagueId)
      .get()
      .then(function (doc) {
        if (doc.exists) {
          var tmp = doc.data()
          if (tmp.password === password) return true
          else return false
        } else return false
      })
  },
  hasLeaguePassword (leagueId) {
    logger.logIt('Checking league password for league: ' + leagueId)
    return db.collection('leaguePassword')
      .doc(leagueId)
      .get()
      .then(function (doc) {
        if (doc.exists) {
          var tmp = doc.data()
          if (tmp.password) return true
          else return false
        } else return false
      })
  },
  getLeaguePassword (leagueId) {
    logger.logIt('Getting leaguePassword')
    return db.collection('leaguePassword')
      .doc(leagueId)
      .get()
      .then(function (doc) {
        if (doc.exists) {
          var tmp = doc.data()
          return tmp.password
        } else return null
      })
  },
  getAllLeagues () {
    logger.logIt('Getting all unlocked leagues.')
    var tmpReturn = []
    return db.collection('leagues')
      .where('data.isLocked', '==', false)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          var tmpObj = doc.data().data
          tmpObj.docId = doc.id
          tmpReturn.push(tmpObj)
        })
        return tmpReturn
      })
  }
}
