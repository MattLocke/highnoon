import Home from '@/components/Home'
import Styles from '@/components/Styles'
import Profile from '@/components/Profile'
import Matchup from '@/components/Matchup'
import CreateLeague from '@/components/CreateLeague'
import ViewLeague from '@/components/ViewLeague'
import Login from '@/components/Login'
import ViewTeam from '@/components/ViewTeam'
import Logout from '@/components/Logout'
import Admin from '@/components/Admin'
import FAQ from '@/components/FAQ'
import Leaderboard from '@/components/Leaderboard'
import Stats from '@/components/Stats'
import News from '@/components/News'
import Featured from '@/components/Featured'
import Bob from '@/components/Bob'
import Scripts from '@/components/Scripts'
import Article from '@/components/Article'
import Messages from '@/components/Messages'
import StreamChat from '@/components/StreamChat'
import LeaguePicks from '@/components/LeaguePicks'
import Info from '@/components/Info'
import Gig from '@/components/Gig'
import Contest from '@/components/Contest'

export const routes = [
  {
    path: '/Contest',
    name: 'Contest',
    component: Contest
  },
  {
    path: '/Gig',
    name: 'Gig',
    component: Gig
  },
  {
    path: '/Info',
    name: 'Info',
    component: Info
  },
  {
    path: '/LeaguePicks/:leagueId/:matchId',
    name: 'LeaguePicks',
    component: LeaguePicks
  },
  {
    path: '/StreamChat/:leagueId',
    name: 'StreamChat',
    component: StreamChat
  },
  {
    path: '/Scripts/:scriptName',
    name: 'Scripts',
    component: Scripts
  },
  {
    path: '/Bob',
    name: 'Bob',
    component: Bob
  },
  {
    path: '/Messages/:conversationId',
    name: 'Messages',
    component: Messages
  },
  {
    path: '/Article/:articleId',
    name: 'Article',
    component: Article
  },
  {
    path: '/News/:articleId?',
    name: 'News',
    component: News
  },
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/FAQ',
    name: 'FAQ',
    component: FAQ
  },
  {
    path: '/Admin',
    name: 'Admin',
    component: Admin
  },
  {
    path: '/Styles',
    name: 'Styles',
    component: Styles
  },
  {
    path: '/Profile/:profileId?',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/Matchup/:numMaps/:leagueId/:matchId/:pickId?',
    name: 'Matchup',
    component: Matchup
  },
  {
    path: '/CreateLeague',
    name: 'CreateLeague',
    component: CreateLeague
  },
  {
    path: '/ViewLeague/:leagueId',
    name: 'ViewLeague',
    component: ViewLeague
  },
  {
    path: '/Login/:leagueId?',
    name: 'Login',
    component: Login
  },
  {
    path: '/ViewTeam',
    name: 'ViewTeam',
    component: ViewTeam
  },
  {
    path: '/Logout',
    name: 'Logout',
    component: Logout
  },
  {
    path: '/Leaderboard',
    name: 'Leaderboard',
    component: Leaderboard
  },
  {
    path: '/Stats',
    name: 'Stats',
    component: Stats
  },
  {
    path: '/Featured',
    name: 'Featured',
    component: Featured
  }
]
