// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Router from 'vue-router'
import { routes } from './router'
import moment from 'moment-timezone'
import VueMarkdown from 'vue-markdown'
import VuePaginate from 'vue-paginate'
import Vuex from 'vuex'
import { sync } from 'vuex-router-sync'
import VuexStore from './vuex/store'
import VueLocalStorage from 'vue-localstorage'

Vue.use(VueLocalStorage)
Vue.use(VuePaginate)
Vue.use(Vuex)
Vue.use(Router)

const store = new Vuex.Store(VuexStore)
const router = new Router({
  routes
})

sync(store, router)

Vue.config.productionTip = false

Vue.filter('formatDate', function (value) {
  if (value) return moment(value * 1000).format('MMM D, h:mm a')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App,
    VueMarkdown,
    store
  }
})
