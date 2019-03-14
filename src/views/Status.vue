<template lang="pug">
  .status.container
    section
      h1 Feedback
    section.feedback-container(v-for="(feedback, index) in feedbackItems" v-if="feedback.when")
      .columns.is-mobile
        .column.is-narrow
          p.ow-font {{ feedback.userName }}
        .column
          p {{ feedback.message }}
        .column.is-narrow(v-if="userData.isAdmin")
          confirm-button(buttonText="Delete" confirmText="Sure?" @confirm-it="deleteFeedback(feedback.id)")
      p.mice {{ feedback.url }}
      p.mice {{ feedback.when | formatJSDate }}
</template>

<script>
import { orderBy } from 'lodash'
import firebase from 'firebase/app'
import 'firebase/firestore'

export default {
  name: 'Status',
  data () {
    return {
      feedbackItems: []
    }
  },
  computed: {
    userData () {
      return this.$store.getters.getUserData
    }
  },
  mounted () {
    this.getFeedback()
  },
  methods: {
    getFeedback () {
      firebase.firestore().collection('feedback')
        .get()
        .then(messages => messages.docs.map(message => ({ id: message.id, ...message.data() })))
        .then(messages => {
          this.feedbackItems = orderBy(messages, ['when'], ['desc'])
        })
    },
    deleteFeedback (id) {
      if (this.userData.isAdmin) {
        firebase.firestore().collection('feedback')
          .doc(id)
          .delete()
          .then(() => {
            this.getFeedback()
          })
      }
    }
  }
}
</script>

<style lang="scss">
.mice {
  font-size: .6rem;
}
</style>
