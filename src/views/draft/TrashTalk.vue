<template lang="pug">
  section.trashtalk
    h2 Trash Talk
    b-field
      b-input(maxlength="200" type="textarea" v-model="newMessage" @keyup.enter="addMessage")
    //- b-field
      picker(@select="addEmoji")
    .columns
      .column
        b-field
          button.button.is-primary(v-if="newMessage.length" @click="addMessage") Send
          button.button.is-primary(v-else disabled) Send
      .column.is-narrow
        //- b-field
          h3 Spectators {{ spectatorChat ? 'can' : 'can not' }} chat
          b-switch(v-model="spectatorChat")
    hr
    .trash-box
      .message-box(v-for="message in messages")
        .from {{ message.userDisplayName }}
          span.is-pulled-right {{ formatWhen(message.when) }}
        .content {{ message.message }}
        hamburger-menu(:menuItems="hamburgerMenuItems(message)")
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'
import moment from 'moment-timezone'
import { Picker } from 'emoji-mart-vue'

export default {
  components: {
    Picker
  },
  props: {
    isOwner: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      messages: [],
      newMessage: '',
      spectatorChat: false
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
  mounted () {
    window.addEventListener('keyup', (event) => {
      if (event.keyCode === 13) {
        this.addMessage()
      }
    })
  },
  methods: {
    addEmoji (emoji) {
      this.newMessage = `${this.newMessage}${emoji.native}`
    },
    hamburgerMenuItems (message) {
      return [
        {
          linkText: 'Delete',
          linkFn: () => this.deleteMessage(message)
        }
      ]
    },
    addMessage () {
      this.cleanMessage()
      if (this.newMessage.length > 1) {
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
      }
    },
    deleteMessage (message) {
      const db = firebase.database()
      let messageKey = null
      // Remove the Message in State
      const allLocalMessages = this.messages
      const compiledMessage = `${message.userDisplayName}${message.when}${message.message}`
      const messageIndex = allLocalMessages.map(localMessage => `${localMessage.userDisplayName}${localMessage.when}${localMessage.message}`).indexOf(compiledMessage)
      this.messages = this.messages.filter((msg, index) => index !== messageIndex)
      db.ref(`/draftMessages/${this.leagueId}`).once('value').then(snapshot => {
        const allMessages = snapshot.val()
        Object.keys(allMessages).forEach(key => {
          if (message.userDisplayName === allMessages[key].userDisplayName) {
            messageKey = key
          }
        })
      })
        .then(() => db.ref(`/draftMessages/${this.leagueId}/${messageKey}`).remove())
    },
    cleanMessage () {
      this.newMessage = this.newMessage.replace(/[\n\r]/g, '')
    },
    formatWhen (theTime) {
      return moment(theTime).format('MMM Do YYYY - h:mm:ss a')
    },
    getMessages () {
      const db = firebase.database()
      db.ref(`/draftMessages/${this.leagueId}`).on('child_added', (snapshot) => {
        this.messages.unshift(snapshot.val())
        // only care about the last 50
        if (this.messages.length > 50) this.messages.length = 50
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
      overflow-x: hidden;
    }
    .message-box {
      background-color: rgba(0,0,0,0.3);
      padding: .5rem;
      .from {
        font-size: .7rem;
      }
      .content {
        word-break: break-word;
      }
      margin-bottom: .25rem;
    }
  }
</style>
