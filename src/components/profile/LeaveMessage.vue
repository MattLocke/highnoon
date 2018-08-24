<template lang="pug">
  .leave-message
    .wrap(v-if="visible")
      .compose-message
        h3.overwatch-font Leave A Message
        textarea.textarea(row='4' v-model="newMessage.message")
        .spacer
        button.button.positive-button(v-on:click="saveMessage()") Message
        hr
        .my-message(v-show="newMessage.message")
          span.sender {{ userData.displayName }}
          span.message-date {{ currentTime | formatDate }}
          vue-markdown(:source="newMessage.message" :html="false")
    .wrap(v-else)
      p You've already started a chat with this user.  Please view your profile to continue the conversation!
</template>

<script>
import vueMarkdown from 'vue-markdown'
import fireMessage from '@/services/messages'

export default {
  name: 'leave-message',
  components: {
    vueMarkdown
  },
  props: [
    'theirId'
  ],
  data () {
    return {
      visible: true,
      newMessage: {
        message: ''
      }
    }
  },
  computed: {
    userData: function () {
      return this.$store.getters.getUserData
    },
    currentTime: function () {
      return new Date().getTime() / 1000
    }
  },
  methods: {
    saveMessage: function () {
      let tmp = this.newMessage
      let _this = this
      tmp.messageDate = new Date().getTime()
      tmp.senderId = this.userData.id
      tmp.senderName = this.userData.displayName
      fireMessage.createMessage(this.userData.id, this.theirId, tmp).then(function (id) {
        if (id) _this.visible = false
      })
    }
  },
  mounted: function () {
    let _this = this
    if (this.userData.id && this.theirId) {
      fireMessage.getMessages(this.userData.id, this.theirId).then(function (messages) {
        if (messages.length) _this.visible = false
      })
    }
  }
}
</script>

<style lang="scss">
  @import '../../variables.scss';
  .preview {
    text-align: right;
  }
  .message-date {
    display: block;
    font-size: .7rem;
  }
  .sender {
    font-weight: bold;
    display: block;
  }
  .their-message {
    border-left: 4px solid #ccc;
    padding: .3rem;
    background-color: #efefef;
    margin-top: .6rem;
    border-radius: 0 8px 8px 0;
  }
  .my-message {
    text-align: right;
    border-right: 4px solid $owp-orange;
    padding: .3rem;
    margin-top: .6rem;
    background-color: #efefef;
    border-radius: 8px 0 0 8px;
  }
  .message-menu {
    padding: 0;
    margin: 0;
    border-right: 1px solid $owp-orange;
  }
  .message-menu li {
    list-style: none;
    padding: 0;
    margin: 0;
    a {
      display: block;
      padding: 4px;
      border-left: 4px solid $owp-orange;
      margin-bottom: 2px;
      font-size: 1.4rem;
      color: $owp-black;
      &:hover {
        background-color: $owp-orange;
      }
    }
    .unread {
      background-color: $owp-red;
      color: #fff;
      padding: 0 4px;
      border-radius: 4px;
      font-size: 1rem;
      display: inline-block;
      margin-top: .35rem;
      min-width: 1.6rem;
      text-align: center;
    }
  }
</style>
