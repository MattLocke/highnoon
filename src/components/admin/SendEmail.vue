<template lang="pug">
  .send-email
    h2 Send Email
    label.label To
    input.input(v-model="to")
    label.label Subject
    input.input(v-model="subject")
    label.label Message
    textarea.textarea(v-model="message")
    a.button.positive-button(v-on:click="sendEmail()") Send Email
</template>

<script>
  import mailgun from '@/services/mailgun'

  export default {
    name: 'send-email',
    data () {
      return {
        to: 'matt@highlevel.io',
        subject: 'test',
        message: 'testing'
      }
    },
    methods: {
      sendEmail: function () {
        mailgun.sendMessage(this.to, this.subject, this.message).then(function (data) {
          console.log(data)
        }).catch(function (error) {
          console.error(error)
        })
      }
    }
  }
</script>