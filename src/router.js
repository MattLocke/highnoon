import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase/app'

import CreateLeague from './views/CreateLeague'
import CreateNews from './views/CreateNews'
import Fantasy from './views/Fantasy'
import Home from './views/Home'
import LeagueFantasy from './views/LeagueFantasy'
import LeaguePickem from './views/LeaguePickem'
import Login from './views/Login'
import Messages from './views/Messages'
import Picks from './views/Picks'
import PlayerProfile from './views/PlayerProfile'
import Profile from './views/Profile'
import Staff from './views/Staff'

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
      path: '/createLeague',
      name: 'createLeague',
      component: CreateLeague,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/createNews',
      name: 'createNews',
      component: CreateNews,
      meta: {
        requiresAuth: true
      }
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
      path: '/messages',
      name: 'messages',
      component: Messages,
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
      path: '/player/:handle',
      name: 'playerProfile',
      component: PlayerProfile,
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
    },
    {
      path: '/staff',
      name: 'staff',
      component: Staff,
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
