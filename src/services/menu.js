export default {
  getMainMenuItems () {
    const prodMenu = [
      {
        name: 'News',
        where: '/home'
      },
      {
        name: 'My Profile',
        where: '/profile',
        requiresAuth: true
      }
    ]
    const devMenu = [
      {
        name: 'News',
        where: '/home'
      },
      {
        name: 'Fantasy',
        where: '/fantasy',
        requiresAuth: true
      },
      {
        name: 'Fantasy League',
        where: '/leagueFantasy',
        requiresAuth: true
      },
      {
        name: 'Pickem Leagues',
        where: '/leaguePickem',
        requiresAuth: true
      },
      {
        name: 'My Picks',
        where: '/picks',
        requiresAuth: true
      },
      {
        name: 'My Profile',
        where: '/profile',
        requiresAuth: true
      },
      {
        name: 'Create League',
        where: '/createLeague',
        requiresAuth: true
      },
      {
        name: 'Messages',
        where: '/messages',
        requiresAuth: true
      },
      {
        name: 'Staff',
        where: '/staff'
      }
    ]
    return process.env.VUE_APP_LOADPROD ? prodMenu : devMenu
  }
}
