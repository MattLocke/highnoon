import Vue from 'vue'
import Buefy from 'buefy'
import firebase from 'firebase/app'
import 'firebase/auth'
import { fireInit } from './fireLogin'
import 'material-design-icons'

import App from './App.vue'
import router from './router'
import store from './store'

Vue.use(Buefy)

Vue.config.productionTip = false

fireInit()

let app

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})
