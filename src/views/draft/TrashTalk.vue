<template lang="pug">
  section.trashtalk
    h3 Trash Talk
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
export default {
  data () {
    return {
      messages: [
        {
          userDisplayName: 'SouldrinK',
          message: 'Welcome to the trash talk!'
        }
      ],
      newMessage: ''
    }
  },
  computed: {
    user () {
      return this.$store.getters.getUserData
    }
  },
  methods: {
    addMessage () {
      const messageObject = {
        userDisplayName: this.user.displayName,
        message: this.newMessage
      }
      this.messages.unshift(messageObject)
      this.newMessage = ''
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
