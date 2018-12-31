const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()

exports.matchlock = null

exports.facilitateDraftPick = functions.database.ref('/draftPicks/{leagueId}')
  .onUpdate((change, context) => {
    // get the draft users, and set the correct one to active
    const leagueId = context.params.leagueId
    const picks = change.after.val()
    let draftOrder = []
    let draft = {}
    // get the draft
    return admin.database().ref(`/draft/${leagueId}`).once('value')
      .then((snapshot) => {
        // console.log(`Setting the draft for league: ${leagueId}`)
        draft = snapshot.val()
        return null
      })
      // get the draftOrder
      .then(() => {
        return admin.database().ref(`/draftOrder/${leagueId}`).once('value')
          .then((snapshot) => {
            // console.log(`Getting the draft order for league: ${leagueId}`)
            draftOrder = snapshot.val()
            return null
          })
          .catch((error) => {
            // console.log(`Error getting the draft order: ${error}`)
          })
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
        if (totalPicks >= (draftOrder.length * 9)) {
          // console.log(`Ending the draft for league: ${leagueId} because total picks (${totalPicks}) was greater than or equal to the max of: ${draftOrder.length * 9}.`)
          return admin.database().ref(`/draft/${leagueId}/status`).set('completed')
        }
        // console.log(`Setting the draft position to ${draftPosition} for league: ${leagueId} with a doneProcessing value of: ${localDraft.doneProcessing}`)
        return admin.database().ref(`/draft/${leagueId}`).set(localDraft)
      })
      .catch((error) => {
        // console.log(`There was an error! ${error}`)
      })
  })

  exports.facilitateDraftPickCreate = functions.database.ref('/draftPicks/{leagueId}')
  .onCreate((snapshot, context) => {
    // get the draft users, and set the correct one to active
    const leagueId = context.params.leagueId
    const picks = snapshot.val()
    let draftOrder = []
    let draft = {}
    // get the draft
    return admin.database().ref(`/draft/${leagueId}`).once('value')
      .then((snapshot) => {
        // console.log(`Setting the draft for league: ${leagueId}`)
        draft = snapshot.val()
        return null
      })
      // get the draftOrder
      .then(() => {
        return admin.database().ref(`/draftOrder/${leagueId}`).once('value')
          .then((snapshot) => {
            // console.log(`Getting the draft order for league: ${leagueId}`)
            draftOrder = snapshot.val()
            return null
          })
          .catch((error) => {
            // console.log(`Error getting the draft order: ${error}`)
          })
      })
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
        if (totalPicks >= (draftOrder.length * 9)) {
          // console.log(`Ending the draft for league: ${leagueId} because total picks (${totalPicks}) was greater than or equal to the max of: ${draftOrder.length * 9}.`)
          return admin.database().ref(`/draft/${leagueId}/status`).set('completed')
        }
        // console.log(`Setting the draft position to ${draftPosition} for league: ${leagueId} with a doneProcessing value of: ${localDraft.doneProcessing}`)
        return admin.database().ref(`/draft/${leagueId}`).set(localDraft)
      })
      .catch((error) => {
        // console.log(`There was an error! ${error}`)
      })
  })