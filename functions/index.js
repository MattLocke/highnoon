const functions = require('firebase-functions');

exports.facilitateDraftPick = functions.database.ref('/draft/{leagueId}/activeDrafter')
  .onUpdate((snapshot, context) => {
    // get the draft users, and set the correct one to active
    const leagueId = context.params.leagueId
    let activeDrafter = snapshot.val()
    let userId = ''
    let preferenceList = []
    let theDraft = {}

    return functions.database.ref(`/draftOrder/${leagueId}`)
      .once('value').then((order) => {
        const theOrder = order.val()
        // we get the ID from the indexed draftOrder
        if (activeDrafter > (theOrder.length - 1)) activeDrafter = 0
        userId = theOrder[activeDrafter].userId
        // we then get draft from the params above, and pass them into the choosePreference method
        // if we have a match, cool.  We'll go ahead an place their pick, if we don't
        // we'll take the top one available inside the draft method.  
        // we'll have to splice the players to make sure everything is solid
      })
      .then(() => {
        // get the draft object
        return functions.database.ref(`/draft/${leagueId}`).once('value')
          .then((snapshot) => {
            theDraft = snapshot.val()
          })
      })
      .then(() => {
        // get the preference list
        return functions.database.ref(`/draftPreference/${leagueId}/${userId}`).once('value')
          .then((snapshot) => {
            preferenceList = snapshot.val()
          })
      })
      .then(() => {
        // see if they have a preference list, if they do - make a pick
        if (preferenceList.length) {
          const foundPlayer = choosePreference(theDraft.availablePlayers, preferenceList)
          if (foundPlayer) {
            // we have a player, time to go through the motions.
            theDraft.selectedPlayers.push(foundPlayer)
            return functions.database.ref(`/draft/${leagueId}`).set(theDraft)
          }
          // no player found, but they have a preference list - so proceed!
          // find the top player
        }
        return Promise.resolve(null)
      })
    // if the active user has a preference list, then snag the available players and choose the best one
    // advance the active user
  })

  exports.handleDraftStatus = functions.database.ref('/draftStatus/{leagueId}')
  .onUpdate((snapshot, context) => {
    // get the draft users, and set the correct one to active
    const leagueId = context.params.leagueId
    const status = snapshot.val()

    if (status === 'active') {
      // we have a new draft starting.  Time to set the active drafter.
      return functions.database.ref(`/draft/${leagueId}`).once('value')
        .then((draft) => {
          const theDraft = draft.val()
          theDraft.activeDrafter = 0
          return functions.database.ref(`/draft/${leagueId}`).set(theDraft)
        })
    }
    if (status === 'completed') {
      // we need to move shit over, and delete a bunch of nodes
      return Promise.resolve(null)
    }
    return Promise.resolve(null)
    // if the active user has a preference list, then snag the available players and choose the best one
    // advance the active user
  })

function choosePreference (players, preference) {
  let found = null
  preference.forEach((choice) => {
    if (!found) found = players.find(player => player.name === choice.name)
  })
  return found
}
