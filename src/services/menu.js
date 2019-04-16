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
      }
    ]
    return process.env.VUE_APP_LOADPROD ? prodMenu : devMenu
  }
}
