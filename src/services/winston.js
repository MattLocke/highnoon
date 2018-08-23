/* For communicating with WinstonsLab */

export default {
  eventUrl (id) {
    return 'https://www.winstonslab.com/events/event.php?id=' + id
  },
  teamUrl (id) {
    return 'https://www.winstonslab.com/teams/team.php?id=' + id
  },
  matchUrl (id) {
    return 'https://www.winstonslab.com/matches/match.php?id=' + id
  }
}
