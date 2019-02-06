<template lang="pug">
  .fix-draft-button
    span Use this button only when the draft becomes frozen!
    button.button.is-primary.is-small(@click="fixDraft") Fix Draft
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'

export default {
  name: 'FixDraftButton',
  props: {
    leagueId: {
      type: String,
      required: true
    }
  },
  methods: {
    fixDraft () {
      firebase.database().ref(`/draft/${this.leagueId}`).update({ doneProcessing: true })
        .then(() => {
          this.$toast.open({
            message: 'This should unfreeze the draft!',
            type: 'is-success',
            position: 'is-bottom'
          })
        })
    }
  }
}
</script>
