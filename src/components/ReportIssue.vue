<template lang="pug">
  .report-issue
    h3.has-pointer(@click="showBox = !showBox") Report Issue
    .report-text(v-if="showBox")
      b-field
        b-input(type="textarea" rows="2" v-model="reportMessage")
      b-field.has-text-centered
        button.button.is-primary.is-small(@click="sendFeedback" v-if="reportMessage.length") Submit
        button.button.is-primary.is-small(disabled v-else) Submit
</template>

<script>
import FeedBackService from '@/services/feedback'

export default {
  name: 'ReportIssue',
  data () {
    return {
      showBox: false,
      reportMessage: ''
    }
  },
  computed: {
    userData () {
      return this.$store.getters.getUserData
    }
  },
  methods: {
    sendFeedback () {
      this.$store.dispatch('setLoading', true)
      const feedback = {
        url: window.location.href,
        userName: this.userData.displayName,
        userId: this.userData.id,
        message: this.reportMessage
      }
      FeedBackService.sendFeedback(feedback)
        .then(() => {
          this.$store.dispatch('setLoading', false)
          this.showBox = false
          this.reportMessage = ''
          this.$toast.open({
            message: 'Successfully sent feedback!',
            type: 'is-success',
            position: 'is-bottom'
          })
        })
        .catch(() => {
          this.$store.dispatch('setLoading', false)
        })
    }
  }
}
</script>

<style lang="scss">
.report-issue {
  position: absolute;
  z-index: 999;
  width: 220px;
  bottom: 0;
  right: 20px;
  background-color: #090c1c;
  border-radius: 8px 8px 0 0;
  h3 {
    text-align: center;
  }
}
</style>
