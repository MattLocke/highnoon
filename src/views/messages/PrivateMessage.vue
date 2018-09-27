<template lang="pug">
  .private-message
    .columns
      .column.is-narrow
        img.message-avatar(:src="message.fromMeta.avatar" v-if="!isUser")
      .column
        .messageWrapper(:class="messageClass(message)")
          p {{ message.message }}
      .column.is-narrow
        img.message-avatar(:src="message.fromMeta.avatar" v-if="isUser")
</template>

<script>
export default {
  props: {
    message: {
      required: true
    }
  },
  data () {
    return {
      userId: 'LSGSGd7SLKJSDF'
    }
  },
  computed: {
    isUser () {
      return (this.message.from === this.userId)
    }
  },
  methods: {
    messageClass (message) {
      if (message.from === this.userId) return { 'is-from': true }
      return { 'is-to': true }
    }
  }
}
</script>

<style lang="scss">
  .message-avatar {
    width: 3rem;
    height: 3rem;
  }

  .is-from {
    text-align: right;
    color: #f99e1a;
  }
  .is-to {
    color: #fff;
  }
  .private-message {
    margin: 1rem 2rem;
  }
</style>
