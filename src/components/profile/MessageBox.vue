<template lang="pug">
  .message-box(v-if="visible")
    .columns
      .column.is-2
        ul.message-menu
          li
            a.overwatch-font(href='#') SouldrinK
              span.is-pulled-right.unread 4
          li
            a.overwatch-font(href='#') Giz
          li
            a.overwatch-font(href='#') Bob
              span.is-pulled-right.unread 2
          li
            a.overwatch-font(href='#') Aretha
      .column.is-10
        .compose-message
          textarea.textarea(row='4' v-model="newMessage.message")
          .spacer
          button.button.positive-button(v-on:click="saveComment()") Reply
          hr
          .my-message(v-show="newMessage.message")
            span.sender SouldrinK
            span.message-date June 17, 8:30pm
            vue-markdown(:source="newMessage.message" :html="false")
        .their-message
          span.sender Bob
          span Hey there, how's it going?
          span.message-date June 17, 8:30pm
        .my-message
          span.sender SouldrinK
          span Not bad, just chillin!
          span.message-date June 17, 9:27pm
        .their-message
          span.sender Bob
          span Hey there, how's it going?
          span.message-date June 17, 8:30pm
        .my-message
          span.sender SouldrinK
          span Not bad, just chillin!
          span.message-date June 17, 9:27pm
        .their-message
          span.sender Bob
          span Hey there, how's it going?
          span.message-date June 17, 8:30pm
        .my-message
          span.sender SouldrinK
          span Not bad, just chillin!
          span.message-date June 17, 9:27pm
        .my-message
          span.sender SouldrinK
          span Not bad, just chillin!
          span.message-date June 17, 9:27pm
</template>

<script>
import vueMarkdown from 'vue-markdown'
import fireMessage from '@/services/messages'

export default {
  name: 'message-box',
  components: {
    vueMarkdown
  },
  props: [
    'message',
    'isOwner',
    'userData'
  ],
  data () {
    return {
      visible: true,
      newMessage: {
        message: ''
      }
    }
  },
  methods: {
    deleteMessage: function (messageId) {
      // var _this = this
      fireMessage.deleteMessage(messageId).then(function (result) {
        // _this.visible = false
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
