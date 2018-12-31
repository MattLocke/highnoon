<template lang="pug">
  section.trashtalk
    h2 Trash Talk
    b-field
      b-input(maxlength="200" type="textarea" v-model="newMessage")
    b-field
      button.button.is-primary(v-if="newMessage.length" @click="addMessage") Send
      button.button.is-primary(v-else disabled) Send
    hr
    .trash-box
      .message-box(v-for="message in messages")
        .from {{ message.userDisplayName }}
        .content {{ message.message }}
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'

export default {
  data () {
    return {
      messages: [],
      newMessage: ''
    }
  },
  computed: {
    user () {
      return this.$store.getters.getUserData
    },
    leagueId () {
      return this.$route.params.leagueId
    }
  },
  watch: {
    leagueId: {
      immediate: true,
      handler (val) {
        if (val) this.getMessages()
      }
    }
  },
  methods: {
    addMessage () {
      const db = firebase.database()
      const messageObject = {
        userDisplayName: this.user.displayName,
        message: this.newMessage,
        when: new Date().getTime()
      }
      db.ref(`/draftMessages/${this.leagueId}`).push(messageObject)
        .then(() => {
          this.newMessage = ''
        })
    },
    getMessages () {
      const db = firebase.database()
      db.ref(`/draftMessages/${this.leagueId}`).on('child_added', (snapshot) => {
        this.messages.unshift(snapshot.val())
      })
    }
  }
}
</script>

<style lang="scss">
  .trashtalk {
    .trash-box {
      max-height: 50vh;
      overflow: auto;
    }
    .message-box {
      background-color: rgba(0,0,0,0.3);
      padding: .5rem;
      .from {
        font-size: .7rem;
      }
      margin-bottom: .25rem;
    }
  }
</style>
