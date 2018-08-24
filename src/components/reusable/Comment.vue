<template lang="pug">
  .comment(v-if="visible")
    article.media
      figure.media-left
        p.image.is-64x64.avatar
          img(v-bind:src="comment.userAvatar")
        p.image.is-48x48.favorite-team(v-if="comment.teamLogoUrl")
          img(v-bind:src="comment.teamLogoUrl")
      .media-content
        .content
          p.author {{ comment.userDisplayName }}
          p.date {{ (comment.postDate/1000) | formatDate}}
          vue-markdown(:source="comment.comment" :html="false")
          .remove(v-if="(comment.userId === userData.id) || isOwner")
            a(v-if="!comment.checkSure", v-on:click="comment.checkSure = true") delete
            a(v-if="comment.checkSure", v-on:click="deleteComment(comment.id)") sure?
</template>

<script>
import vueMarkdown from 'vue-markdown'
import fireComment from '@/services/comment'

export default {
  name: 'comment',
  components: {
    vueMarkdown
  },
  props: [
    'comment',
    'isOwner',
    'userData',
    'commentType'
  ],
  data () {
    return {
      visible: true
    }
  },
  methods: {
    deleteComment: function (commentId) {
      var _this = this
      if (this.commentType === 'article') {
        fireComment.deleteArticleComment(commentId).then(function (result) {
          _this.visible = false
        })
      } else {
        fireComment.deleteComment(commentId).then(function (result) {
          _this.visible = false
        })
      }
    }
  }
}
</script>
