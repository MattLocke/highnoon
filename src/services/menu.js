export default {
  getMainMenuItems () {
    const prodMenu = [
      {
        name: 'News',
        where: '/home'
      },
      {
        name: 'Leagues',
        where: '/leagues',
        requiresAuth: true
      },
      {
        name: 'Stats',
        where: '/stats',
      }
    ]
    const devMenu = [
      {
        name: 'News',
        where: '/home'
      },
      {
        name: 'Leagues',
        where: '/leagues'
      },
      {
        name: 'Staff',
        where: '/staff'
      },
      {
        name: 'Stats',
        where: '/stats',
      }
    ]
    return process.env.VUE_APP_LOADPROD ? prodMenu : devMenu
  }
}
