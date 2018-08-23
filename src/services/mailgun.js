import base64 from 'base-64'
var apiKey = 'key-102f8fa0ccfb9ff66ace58ea7807e559'
var baseUrl = 'https://api.mailgun.net/v3/mg.highnoonpickem.com/messages'

export default {
  sendMessage (to, subject, message) {
    var data = {
      from: 'noreply@highnoonpickem.com',
      to: to,
      subject: subject,
      text: message
    }

    var headers = new Headers()
    headers.append('Authorization', 'Basic ' + base64.encode('api:' + apiKey))
    headers.append('Content-Type', 'multipart/form-data')

    console.log('sending email...')
    return fetch(baseUrl, {
      body: data,
      headers,
      method: 'POST',
      mode: 'no-cors'
    })
  }
}
