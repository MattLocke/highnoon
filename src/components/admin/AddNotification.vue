<template lang="pug">
  .add-notification
    vue-markdown(:source="notification.message")
    textarea.textarea(rows='3' v-model="notification.message")
    br
    button.button.positive-button(v-on:click="saveNotification()") Save Notification
</template>

<script>
  import fireNotifications from '@/services/notification'
  import vueMarkdown from 'vue-markdown'

  export default {
    name: 'add-notification',
    components: {
      vueMarkdown
    },
    data () {
      return {
        notification: {
          message: ''
        },
        noteId: 'homePage'
      }
    },
    methods: {
      saveNotification: function () {
        var _this = this
        fireNotifications.saveNotification(_this.notification, _this.noteId).then(function (response) {
          console.log(response)
          if (response) alert('Saved Notification.')
          else alert('Unable to save notification')
        })
      }
    },
    mounted: function () {
      var _this = this
      fireNotifications.getNotification(_this.noteId).then(function (notification) {
        _this.notification = notification
      })
    }
  }
</script>