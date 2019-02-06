const _ = require('lodash')
const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()

const firestore = admin.firestore()

// Add this magical line of code:
firestore.settings({ timestampsInSnapshots: true })

exports.matchlock = null

exports.facilitateDraftPick = functions.database.ref('/draftPicks/{leagueId}')
  .onUpdate((change, context) => {
    // get the draft users, and set the correct one to active
    const leagueId = context.params.leagueId
    const picks = change.after.val()
    
    return workDraftPick (leagueId, picks)
  })

exports.facilitateDraftPickCreate = functions.database.ref('/draftPicks/{leagueId}')
  .onCreate((snapshot, context) => {
    // get the draft users, and set the correct one to active
    const leagueId = context.params.leagueId
    const picks = snapshot.val()
    
    return workDraftPick (leagueId, picks)
  })

exports.tryAutomatedPick = functions.database.ref('/draft/{leagueId}')
  .onUpdate((change, context) => {
    const after = change.after.val()
    const leagueId = context.params.leagueId
    let userId = ''
    let selectedPlayer = null

    if (after.status === 'active') {
      console.log('===================================')
      console.log(`We detected activity for league: ${leagueId}.  Checking for preference list.`)
      return admin.database().ref(`/draftOrder/${leagueId}`).once('value')
        .then((users) => {
          const userArray = users.val()
          return userArray[after.activeDrafter]
        })
        .then((user) => {
          userId = user.userId
          return admin.database().ref(`/draftPreference/${leagueId}/${user.userId}`).once('value')
        })
        .then((preferenceList) => {
          console.log(`We ${preferenceList.val() ? 'found ' : 'did not find '}a preference list.`)
          const prefList = preferenceList.val() || {}
          // make sure they have opted in
          if (prefList && prefList.autoMode) return processPreferenceList(prefList.players, after, leagueId)
          // if not, pass null down the chain
          return null
        })
        .then((thePlayer) => {
          selectedPlayer = thePlayer
          // console.log(`We have a selected player value of: ${selectedPlayer.name}`)
          return selectedPlayer ? admin.database().ref(`/draftPicks/${leagueId}/${userId}`).once('value') : null
        })
        .then((userPicks) => {
          if (userPicks) {
            var tmpPicks = userPicks.val() || null
            if (tmpPicks) tmpPicks.push(selectedPlayer)
            else tmpPicks = [selectedPlayer]
            console.log(`Setting a pick at : /draftPicks/${leagueId}/${userId} of ${selectedPlayer.name}`)
            return admin.database().ref(`/draftPicks/${leagueId}/${userId}`).set(tmpPicks)
          }
          console.log('Not setting anything.  Moving on!')
          return null
        })
    } else {
      return null
    }
  })

exports.tradePlayer = functions.database.ref('/trades/{leagueId}/{tradeId}')
  .onUpdate((change, context) => {
    const trade = change.after.val()
    console.log(`Status of trade updated to: ${trade.status}`)
    return performTradeFirebase(trade)
  })

function workDraftPick (leagueId, picks) {
  let draftOrder = []
  let draft = {}

  return admin.database().ref(`/draft/${leagueId}`).once('value')
    .then((snapshot) => {
      // console.log(`-----Setting the draft for league: ${leagueId}`)
      draft = snapshot.val()
      return null
    })
    // get the draftOrder
    .then(() => {
      return admin.database().ref(`/draftOrder/${leagueId}`).once('value')
    })
    .then((snapshot) => {
      // console.log(`Getting the draft order for league: ${leagueId}`)
      draftOrder = snapshot.val()
      return null
    })
    // snaking the draft
    .then(() => {
      let draftPosition = draft.activeDrafter
      let totalPicks = 0
      const localDraft = draft
      localDraft.doneProcessing = true

      // console.log(`Draft position is currently: ${draftPosition}`)

      if (localDraft.direction === 'forward') {
        draftPosition = draftPosition + 1
        // console.log('Moving draft forward')
      } else {
        draftPosition = draftPosition - 1
        // console.log('Moving draft backward')
      }

      if (draftPosition === -1) {
        draftPosition = 0
        localDraft.direction = 'forward'
      }

      if (draftPosition === draftOrder.length) {
        draftPosition = draftOrder.length - 1
        localDraft.direction = 'reverse'
      }

      // console.log(`Draft position is now: ${draftPosition}`)

      localDraft.activeDrafter = draftPosition

      Object.keys(picks).forEach((userPicks) => {
        totalPicks += picks[userPicks].length
      })

      // If we're maxed on picks, just end the draft
      if (totalPicks >= (draftOrder.length * 12)) {
        console.log(`------Ending the draft for league: ${leagueId} because total picks (${totalPicks}) was greater than or equal to the max of: ${draftOrder.length * 9}.`)
        return admin.database().ref(`/draft/${leagueId}/status`).set('completed')
      }
      // console.log(`------Setting the draft position to ${draftPosition} for league: ${leagueId} with a doneProcessing value of: ${localDraft.doneProcessing}`)
      return admin.database().ref(`/draft/${leagueId}`).set(localDraft)
    })
    .catch((error) => {
      console.log(`There was an error! ${error}`)
    })
}

function processPreferenceList (preferenceList, league, leagueId) {
  if (preferenceList) {
    console.log(`We found a preference list.  Checking for available players in ${leagueId}`)
    let players = [...league.players]
    let lumpedPicks = []
    let rawPicks = []
    let unclaimedPlayers = []
    let unclaimedPreference = []
    let userId = ''
    // get users to get an id
    return admin.database().ref(`/draftOrder/${leagueId}`).once('value')
        .then((users) => {
          return users.val()[league.activeDrafter]
        })
        .then((user) => {
          userId = user.userId
          // get draftPicks
          return admin.database().ref(`/draftPicks/${leagueId}`).once('value')
        })
        .then((thePicks) => {
          // build draft picks into single array
          rawPicks = thePicks.val() || {}
          var tmp = thePicks.val() ? Object.values(thePicks.val()) : []
          tmp.forEach((child) => {
            if (child.length) child.forEach(pick => lumpedPicks.push(pick))
          })

          if (lumpedPicks) console.log(`We have ${lumpedPicks.length} picks so far.`)
          // remove array from preferenceList
          unclaimedPlayers = _.differenceWith(players, lumpedPicks, _.isEqual)
          console.log(`We have ${players.length} players total.`)
          unclaimedPreference = unclaimedPlayers.filter(o1 => preferenceList.some(o2 => o1.name === o2.name));
          const missingType = findMissing(rawPicks, userId)
          // if we have a preference list left, take the top player.
          if (unclaimedPreference && unclaimedPreference.length) {
            // figure out what the best option is for them (hard)
            if (missingType) {
              let tP = unclaimedPreference.find(up => up.attributes.role === missingType)
              if (tP) return tP
            }
            return unclaimedPreference[0]
          }
          // if the preference list is gone, take the first available player
          if (missingType) {
            tP = unclaimedPlayers.find(up => up.attributes.role === missingType)
            if (tP) return tP
          }
          return unclaimedPlayers[0]
        }).catch((error) => {
          console.log(error)
        })
  } else {
    console.log('No player preference list found for user.')
    return null
  }
}

function findMissing (allPicks, userId) {
  console.log(`Checking missing roles for ${userId}`)
  const roles = {
    offense: 0,
    tank: 0,
    support: 0
  }
  if (allPicks[userId] && allPicks[userId].length) {
    console.log(`We found picks for: ${userId}`)
    const tmp = [ ...allPicks[userId] ]
    tmp.forEach(pick => {
      roles[pick.attributes.role] = roles[pick.attributes.role] + 1
    })
  }
  console.log(`Missing roles check: ${JSON.stringify(roles)}`)
  if (roles.offense < 2) return 'offense'
  if (roles.tank < 2) return 'tank'
  if (roles.support < 2) return 'support'
  return null
}

function performTradeFirebase (trade) {
  if (trade.status === 'active') {
    const askerPicksRef = admin.database().ref(`draftPicks/${trade.leagueId}/${trade.askerId}`)
    const responderPicksRef = admin.database().ref(`draftPicks/${trade.leagueId}/${trade.responderId}`)
    const tradeRef = admin.database().ref(`trades/${trade.leagueId}/${trade.id}`)
    const rostersRef = admin.firestore().collection('standardLeagueRoster').doc(trade.leagueId)

    var updateAskerPicks = askerPicksRef.once('value', (snapshot) => {
      var askerPicks = snapshot.val()
      fancyLog('Getting Asker Picks')

      // remove player from askers picks, add player
      console.log(`Asker Picks Length: ${askerPicks.length}`)
      var askerPicksClean = askerPicks.filter(pick => pick.id !== trade.askerPlayer.id)
      console.log(`Asker Picks Length After Removal: ${askerPicksClean.length}`)
      if (askerPicks.length > askerPicksClean.length) askerPicksClean.push(trade.responderPlayer)
      console.log(`Asker Picks Length After New Addition: ${askerPicksClean.length}`)
      return askerPicksRef.set(askerPicksClean)
    })

    var updateResponderPicks = responderPicksRef.once('value', (snapshot) => {
      var responderPicks = snapshot.val()
      fancyLog('Getting Responder Picks')

      // remove player from responders picks, add player
      console.log(`Responder Picks Length: ${responderPicks.length}`)
      var responderPicksClean = responderPicks.filter(pick => pick.id !== trade.responderPlayer.id)
      console.log(`Responder Picks Length After Removal: ${responderPicksClean.length}`)
      responderPicksClean.push(trade.responderPlayer)
      console.log(`Responder Picks Length After New Addition: ${responderPicksClean.length}`)
      return responderPicksRef.set(responderPicksClean)
    })

    var updateRoster = rostersRef.get().then(doc => {
      var fullRoster = doc.data()
      if (fullRoster && fullRoster[trade.responderId]) {
        var askerRoster = cleanRoster(fullRoster[trade.askerId].roster, trade.askerPlayer)
        var responderRoster = cleanRoster(fullRoster[trade.responderId].roster, trade.responderPlayer)
        fancyLog('Updating Roster')
        var newRoster = { ...fullRoster }
        if (!_.isEqual(askerRoster, fullRoster[trade.askerId].roster) || !_.isEqual(responderRoster, fullRoster[trade.responderId].roster)) {
          // this means someone traded someone out of their roster, so we have to do stuff :(
          newRoster[trade.askerId].roster = askerRoster
          newRoster[trade.responderId].roster = responderRoster
        }
        return rostersRef.set(newRoster)
      }
      return null
    })

    var updateTrade = tradeRef.update({ status: 'complete' })
    
    return Promise.all([updateAskerPicks, updateResponderPicks, updateRoster, updateTrade])
  } else {
    return Promise.resolve(true)
  }
}

function cleanRoster(roster, player) {
  var r = { ...roster }
  if (_.isEqual(r.captain, player)) r.captain = {}
  if (_.isEqual(r.offense1, player)) r.offense1 = {}
  if (_.isEqual(r.offense2, player)) r.offense2 = {}
  if (_.isEqual(r.support1, player)) r.support1 = {}
  if (_.isEqual(r.support2, player)) r.support2 = {}
  if (_.isEqual(r.tank1, player)) r.tank1 = {}
  if (_.isEqual(r.tank2, player)) r.tank2 = {}
  return r
}

function fancyLog(message) {
  console.log(`--------------------`)
  console.log(message)
  console.log(`--------------------`)
}
