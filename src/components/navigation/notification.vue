<template lang="pug">
  .notification.is-warning(v-if="notification.message")
    button.delete(v-on:click="notification.message = ''")
    .wrap
      vue-markdown(:source="notification.message")
</template>

<script>
  import fireNotifications from '@/services/notification'
  import vueMarkdown from 'vue-markdown'

  export default {
    name: 'notification',
    components: {
      vueMarkdown
    },
    data () {
      return {
        notification: {
          message: ''
        }
      }
    },
    methods: {
      getNotifications: function () {
        var _this = this
        fireNotifications.getNotification('homePage').then(function (notification) {
          _this.notification = notification
        })
      }
    },
    mounted: function () {
      this.getNotifications()
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../variables.scss';
  .is-warning {
    background-color: $owp-orange;
    color: #fff;
  }
</style>