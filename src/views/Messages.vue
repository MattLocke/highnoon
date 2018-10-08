<template lang="pug">
  .messages
    .columns
      .column.is-one-quarter.is-left-menu
        .wrap
          .box
            h1 Messages
            hr
            message-list
      .column
        .pm(v-for="message in messages")
          private-message(:message="message")
        compose-message
</template>

<script>
import ComposeMessage from '@/views/messages/ComposeMessage'
import MessageList from '@/views/messages/MessageList'
import PrivateMessage from '@/views/messages/PrivateMessage'

export default {
  components: {
    ComposeMessage,
    PrivateMessage,
    MessageList
  },
  data () {
    return {
      userId: 'LSGSGd7SLKJSDF',
      messages: [
        {
          id: 'LSGLSHDGLSJG',
          from: 'LSGSGd7SLKJSDF',
          to: 'LSGSGd7SLKJSRR',
          message: 'Hey dude, what\'s up?',
          timestamp: '1537673186',
          toMeta: {
            name: 'moosetube',
            avatar: 'https://firebasestorage.googleapis.com/v0/b/overwatch-pickem.appspot.com/o/images%2Fusers%2F52kfnGgOpxcc1tzeZvyWl3h59eG2.jpg?alt=media&token=8a22819d-441a-4a96-8f42-38cc3f31444d'
          },
          fromMeta: {
            name: 'SouldrinK',
            avatar: 'https://firebasestorage.googleapis.com/v0/b/overwatch-pickem.appspot.com/o/images%2Fusers%2FokX0pkZmoRg4d5XY0xy3ij9ohjo1.jpg?alt=media&token=e34af651-7c9f-4ce2-b945-12888b4af2e0'
          }
        },
        {
          id: 'LSGLSHDGLSJG',
          from: 'LSGSGd7SLKJSRR',
          to: 'LSGSGd7SLKJSDF',
          message: 'Not much man!',
          timestamp: '1537673636',
          toMeta: {
            name: 'SouldrinK',
            avatar: 'https://firebasestorage.googleapis.com/v0/b/overwatch-pickem.appspot.com/o/images%2Fusers%2FokX0pkZmoRg4d5XY0xy3ij9ohjo1.jpg?alt=media&token=e34af651-7c9f-4ce2-b945-12888b4af2e0'
          },
          fromMeta: {
            name: 'moosetube',
            avatar: 'https://firebasestorage.googleapis.com/v0/b/overwatch-pickem.appspot.com/o/images%2Fusers%2F52kfnGgOpxcc1tzeZvyWl3h59eG2.jpg?alt=media&token=8a22819d-441a-4a96-8f42-38cc3f31444d'
          }
        }
      ]
    }
  }
}
</script>

<style lang="scss">

</style>
