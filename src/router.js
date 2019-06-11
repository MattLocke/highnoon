import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase/app'

import Article from './views/Article'
import CreateLeague from './views/CreateLeague'
import CreateNews from './views/CreateNews'
import Draft from './views/Draft'
import DraftPreference from './views/DraftPreference'
import Fantasy from './views/Fantasy'
import Gig from './views/Gig'
import Home from './views/Home'
import HowStandardWorks from './views/HowStandardWorks'
import LeaderboardPickem from './views/GlobalPickem'
import LeaderboardUnlimited from './views/GlobalUnlimited'
import LeagueMatchups from './views/LeagueMatchups'
import LeagueStandard from './views/LeagueStandard'
import LeagueUnlimited from './views/LeagueUnlimited'
import LeaguePickem from './views/LeaguePickem'
import Leagues from './views/Leagues'
import Login from './views/Login'
import ManageTeam from './views/ManageFantasyTeam'
import ManageUnlimitedTeam from './views/ManageUnlimitedTeam'
import Messages from './views/Messages'
import PlayerProfile from './views/PlayerProfile'
import Premier from './views/Premier'
import Profile from './views/Profile'
import PublicProfile from './views/ProfilePublic'
import Stats from './views/Stats'
import Status from './views/Status'
import Staff from './views/Staff'
import Upload from './views/Upload'

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
      path: '/createLeague',
      name: 'createLeague',
      component: CreateLeague,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/draft/:leagueId',
      name: 'draft',
      component: Draft,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/draftPreference/:leagueId?',
      name: 'draftPreference',
      component: DraftPreference,
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
      path: '/gig',
      name: 'gig',
      component: Gig,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/howStandardWorks',
      name: 'howStandardWorks',
      component: HowStandardWorks
    },
    {
      path: '/LeaderboardPickem',
      name: 'LeaderboardPickem',
      component: LeaderboardPickem,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/LeaderboardUnlmited',
      name: 'LeaderboardUnlimited',
      component: LeaderboardUnlimited
    },
    {
      path: '/leagueMatchups/:leagueId/:week',
      name: 'leagueMatchups',
      component: LeagueMatchups,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/LeaguePickem/:leagueId',
      name: 'LeaguePickem',
      component: LeaguePickem,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/leagues/:leagueId?',
      name: 'leagues',
      component: Leagues,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/LeagueStandard/:leagueId',
      name: 'LeagueStandard',
      component: LeagueStandard,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/LeagueUnlimited/:leagueId',
      name: 'LeagueUnlimited',
      component: LeagueUnlimited,
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
      path: '/manageTeam/:leagueId',
      name: 'manageTeam',
      component: ManageTeam,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/manageUnlimitedTeam/:leagueId',
      name: 'manageUnlimitedTeam',
      component: ManageUnlimitedTeam,
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
      path: '/player/:handle',
      name: 'playerProfile',
      component: PlayerProfile,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/premier',
      name: 'premier',
      component: Premier,
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
    },
    {
      path: '/stats/:week?',
      name: 'stats',
      component: Stats
    },
    {
      path: '/status',
      name: 'status',
      component: Status,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/upload',
      name: 'upload',
      component: Upload,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/user/:userId',
      name: 'user',
      component: PublicProfile,
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
