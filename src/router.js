import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase/app'

import Fantasy from './views/Fantasy.vue'
import Home from './views/Home.vue'
import LeagueFantasy from './views/LeagueFantasy.vue'
import LeaguePickem from './views/LeaguePickem.vue'
import Login from './views/Login.vue'
import Picks from './views/Picks.vue'
import Profile from './views/Profile.vue'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '*',
      redirect: 'login'
    },
    {
      path: '/',
      redirect: 'login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/fantasy',
      name: 'fantasy',
      component: Fantasy,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/leagueFantasy',
      name: 'leagueFantasy',
      component: LeagueFantasy,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/leaguePickem',
      name: 'leaguePickem',
      component: LeaguePickem,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/picks',
      name: 'picks',
      component: Picks,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !currentUser) next('login')
  else if (!requiresAuth && currentUser) next('home')
  else next()
})

export default router
