import md5 from 'md5'

export default {
  getProfilePic (email, size) {
    var lower = email.toLowerCase()
    var hash = md5(lower)
    var defaultAvatar = encodeURI('https://highnoonpickem.com/static/img/default-avatar.jpg')
    return 'https://www.gravatar.com/avatar/' + hash + '?s=' + size + '?d=' + defaultAvatar
  }
}
