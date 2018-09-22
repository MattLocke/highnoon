# High Noon

## Messaging
For messaging I'm thinking I'll set up a listener on firebase, and when a message is sent to a user, the message gets copied to the
Cloud Firestore, as well as to Firebase.  This will allow us to notify the user live when they have a new message, and correctly
mark all read in firebase by removing the thread node.  

1. New message from X gets sent to Y in thread Z
2. Cloud Firestore will get the message under THREAD/message.
3. Firebase will get the message under MESSAGES/USERID/Z/message
4. When user views the message, MESSAGES/USERID/Z will be deleted in Firebase, clearing the notifications.

For leagues:

1. New message is posted to the league in Cloud Firestore under LeagueMessages/LEAGUEID/message.
2. When getting league data, the user will have a [TIMESTAMP] on the league node for "lastViewedLeague".
3. There will be a DB call to Cloud Firestore for all league messages after [TIMESTAMP] (only on initial page load).
4. When a user visits a league page, it will update the [TIMESTAMP] and make the db call again, updating the notification count.
