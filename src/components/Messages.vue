<template lang="pug">
  .messages
    section.section
      .container
        .box
          h2 Messages between SouldrinK and Aretha
          .message-wrapper
            .message(v-for="m in messages")
              p {{ m.message }}
              span {{ m.authorName }}
          article.media
            figure.media-left
              p.image.is-64x64.avatar
                img(v-bind:src="userData.avatarUrl")
              p.image.is-48x48.favorite-team(v-if="userData.teamLogoUrl")
                img(v-bind:src="userData.teamLogoUrl")
            .media-content
              .content
                p.author {{ userData.displayName }}
                p.date {{ (new Date().getTime()/1000) | formatDate}}
                vue-markdown(:source="newComment.comment" :html="false")
          textarea.textarea(row='4' v-model="newComment.comment") {{ newComment.content }}
          button.button.positive-button(v-on:click="saveComment()") Post
</template>

<script>
export default {
  name: 'messages',
  data () {
    return {
      messages: [
        {
          posted: 1517897347,
          authorId: 'Vq1h1yfQKeeG8RbwLd8ATsK4wgE3',
          authorName: 'SouldrinK',
          message: 'Testing 123'
        },
        {
          posted: 1517897365,
          authorId: 'XTx4TyFQlZbKwmebU7rB0G1eaRk1',
          authorName: 'aretha',
          message: 'This is a test too.'
        }
      ],
      newComment: {
        comment: ''
      }
    }
  },
  computed: {
    userData: function () {
      return this.$store.getters.getUserData
    }
  },
  methods: {
    saveComment: function () {

    }
  },
  mounted: function () {
  }
}
</script>

<style scoped>
  .seen {
    color: #888;
  }
  .message {
    padding: .5rem;
  }
</style>
