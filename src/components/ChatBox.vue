<template lang="pug">
  .chatbox(v-if="showChat")
    .chatTitle
      span {{ chatTitle }}
    .message-window
      .message(v-for="m in messages")
</template>

<script>
export default {
  name: 'chatbox',
  props: ['conversationId'],
  data () {
    return {
      messages: [],
      message: ''
    }
  },
  computed: {
    userData: function () {
      return this.$store.getters.getUserData
    },
    showChat: function () {
      return this.userData.showChat || false
    },
    chatTitle: function () {
      return 'Messages'
    }
  }
}
</script>

<style lang="scss" scoped>
  .chatbox {
    width: 300px;
    position: fixed;
    z-index: 999;
    bottom: 0;
    right: 10px;
    background-color: #F00;
    border-radius: 8px 8px 0 0
  }
  .chatTitle {
    padding: .4rem;
    span {
      color: #fff;
    }
  }
</style>
