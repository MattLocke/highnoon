<template lang="pug">
  .notifications
    .wrap(v-if="notification.message")
      .box
        .orange-box.notification
          vue-markdown(:source="notification.message")
      br
</template>

<script>
import fireNotifications from '@/services/notification'
import vueMarkdown from 'vue-markdown'

export default {
  name: 'notifications',
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
  .orange-box {
    border-radius: 4px;
    border: 1px solid $owp-orange;
    padding: 8px;
  }
  .notification {
    background-color: $owp-orange;
    color: #fff;
  }
</style>
