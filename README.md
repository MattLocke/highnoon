# High Noon

## Setup
High Noon is built using the vue-cli.  You can read about how to set that up here:

[https://cli.vuejs.org/](https://cli.vuejs.org/)

After vue-cli is installed, create a project on firebase.  Once you create the project, select "web" from the application type and it will show you the information you need to complete the next step.

In /src, create a new file called `fireLogin.js` and populate it with your information, same as the example below:

```
import firebase from 'firebase/app'

export function fireInit () {
  /* prod */
  const configProd = {
    apiKey: 'YOUR_KEY_HERE',
    authDomain: 'YOUR_PROJECT_NAME.firebaseapp.com',
    databaseURL: 'https://YOUR_PROJECT_NAME.firebaseio.com',
    projectId: 'YOUR_PROJECT_NAME',
    storageBucket: 'YOUR_PROJECT_NAME.appspot.com',
    messagingSenderId: 'YOUR_MESSAGE_ID'
  }

  /* dev */
  const configDev = {
    apiKey: 'YOUR_DEV_KEY_HERE',
    authDomain: 'YOUR_DEV_PROJECT_NAME.firebaseapp.com',
    databaseURL: 'https://YOUR_DEV_PROJECT_NAME.firebaseio.com',
    projectId: 'YOUR_DEV_PROJECT_NAME',
    storageBucket: 'YOUR_DEV_PROJECT_NAME.appspot.com',
    messagingSenderId: 'YOUR_DEV_MESSAGE_ID'
  }

  if (!firebase.apps.length) {
    firebase.initializeApp(process.env.VUE_APP_LOADPROD ? configProd : configDev)
  }
}
```
Now you can go back to your firebase project and in the "Authentication" section, select email/password as an authentication type.  This will allow user accounts to be created.

Once that file is up, you can type:

```
npm run serve
```

and it will load up the dev configure by default.

To run the server in production mode locally, type:
```
npm run serveprod
```

This is only for the web-portion of high noon.  The database and scoring scripts will be released shortly!