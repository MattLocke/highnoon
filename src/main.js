import Vue from 'vue'
import Buefy from 'buefy'
import firebase from 'firebase'
import 'material-design-icons'

import App from './App.vue'
import router from './router'
import store from './store'

Vue.use(Buefy)

Vue.config.productionTip = false

let app

const fireConfig = {
  apiKey: 'AIzaSyCfsM2RsFally3Uu0NDwupjYJXJBkflEl0',
  authDomain: 'overwatch-pickem.firebaseapp.com',
  databaseURL: 'https://overwatch-pickem.firebaseio.com',
  projectId: 'overwatch-pickem',
  storageBucket: 'overwatch-pickem.appspot.com',
  messagingSenderId: '155288469362'
}

firebase.initializeApp(fireConfig)

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})
