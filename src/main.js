import Vue from 'vue'
import Buefy from 'buefy'
import EvaIcons from 'vue-eva-icons'
import VueClipboard from 'vue-clipboard2'
import VueTooltip from 'v-tooltip'
import firebase from 'firebase/app'
import moment from 'moment-timezone'
import 'firebase/auth'
import { fireInit } from './fireLogin'
import 'material-design-icons'
import AsyncComputed from 'vue-async-computed'

import App from './App.vue'
import router from './router'
import store from './store'

import leftBar from './components/LeftBar'
import topBar from './components/TopBar'
import confirmButton from './components/ConfirmButton'
import arrow from './components/Arrow'
import collapsible from './components/Collapsible'
import editableField from './components/EditableField'
import hamburgerMenu from './components/HamburgerMenu'

Vue.use(Buefy)
Vue.use(EvaIcons)
Vue.use(VueClipboard)
Vue.use(AsyncComputed)
Vue.use(VueTooltip)

Vue.config.productionTip = false

Vue.filter('formatDate', function (value) {
  if (value) return moment(value * 1000).format('MMM D, h:mm a')
})
Vue.filter('formatNewsDate', function (value) {
  if (value) return moment(value * 1000).format('MMM D, YYYY')
})
Vue.filter('formatJSDate', function (value) {
  if (value) return moment(value).format('MMM D, YYYY')
})
Vue.filter('formatJSTime', function (value) {
  if (value) return moment(value).format('h:mm a')
})
Vue.filter('capFirst', function (value) {
  if (value) return `${value.charAt(0).toUpperCase()}${value.slice(1)}`
})
Vue.filter('playerScore', function (value) {
  return value ? Number(value).toFixed(2) : 0
})

Vue.component('leftBar', leftBar)
Vue.component('topBar', topBar)
Vue.component('confirmButton', confirmButton)
Vue.component('arrow', arrow)
Vue.component('collapsible', collapsible)
Vue.component('editableField', editableField)
Vue.component('hamburgerMenu', hamburgerMenu)

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
