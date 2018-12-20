import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase/app'

import Article from './views/Article'
import CreateLeague from './views/CreateLeague'
import CreateNews from './views/CreateNews'
import Draft from './views/Draft'
import Fantasy from './views/Fantasy'
import Home from './views/Home'
import LeagueFantasy from './views/LeagueFantasy'
import LeaguePickem from './views/LeaguePickem'
import Leagues from './views/Leagues'
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
      path: '/draft',
      name: 'draft',
      component: Draft,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/article/:articleId',
      name: 'article',
      component: Article
    },
    {
      path: '/createNews/:articleId?',
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
      component: Home
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
      path: '/leagues',
      name: 'leagues',
      component: Leagues,
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
  else next()
})

export default router
