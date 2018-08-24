<template lang="pug">
  .comments
    .box
      h2 Comments
      p(v-if="verified && inLeague")
        a.button.positive-button(v-if="!newCommentMode" v-on:click="newCommentMode = true") Add Comment
      .new-comment-wrapper(v-if="newCommentMode")
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
        button.button.positive-button(v-on:click="saveComment()") Save and close
        button.button.negative-button.is-pulled-right(v-on:click="newCommentMode = false") Cancel
        p.micetype *Remember the league owner may also delete your comments.  Please don't be a jerk.  We have enough toxicity in comp!
      hr
      p(v-if="!comments.length") There are currently no comments for this league!
      comment(v-for="comment in comments" :comment="comment" :isOwner="isOwner" :userData="userData" :key="comment.postDate")
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
              a(v-if="comment.checkSure", v-on:click="deleteComment(comment.id, index)") sure?
</template>

<script>
import vueMarkdown from 'vue-markdown'
import comment from '@/components/reusable/Comment'
import fireComment from '@/services/comment'
import fireImage from '@/services/image'

export default {
  name: 'comments',
  components: {
    vueMarkdown,
    comment
  },
  props: ['userData', 'leagueId', 'isOwner', 'verified', 'inLeague'],
  data () {
    return {
      newCommentMode: false,
      newComment: {
        comment: ''
      },
      comments: []
    }
  },
  watch: {
    leagueId: function (val) {
      this.getTheComments(val)
    },
    userData: function (val) {
      var _this = this
      if (this.userData.avatar) {
        fireImage.getImage('users', this.userData.avatar).then(function (url) {
          _this.userData.avatarUrl = url
        })
      } else {
        _this.userData.avatarUrl = 'https://highnoonpickem.com/static/img/default-avatar.jpg'
      }
      if (this.userData.teamLogo) {
        fireImage.getTeamLogo(_this.userData.teamLogo).then(function (url) {
          _this.userData.teamLogoUrl = url
        })
      }
    }
  },
  methods: {
    saveComment: function () {
      var _this = this
      _this.newComment.userDisplayName = _this.userData.displayName
      _this.newComment.userAvatar = _this.userData.avatarUrl
      _this.newComment.postDate = new Date().getTime()
      _this.newComment.leagueId = _this.leagueId
      _this.newComment.userId = _this.userData.id
      _this.newComment.teamLogo = _this.userData.teamLogo || null
      fireComment.createComment(_this.newComment).then(function () {
        _this.newComment.checkSure = false
        if (_this.newComment.teamLogo) _this.newComment.teamLogoUrl = _this.userData.teamLogoUrl
        _this.comments.unshift(_this.newComment)
        _this.newComment = {comment: ''}
        _this.newCommentMode = false
      })
    },
    getTheComments: function (leagueId) {
      var _this = this
      fireComment.getComments(_this.leagueId).then(function (comments) {
        comments.forEach(function (comment) {
          comment.teamLogoUrl = ''
          comment.checkSure = false
          if (comment.teamLogo) {
            return fireImage.getTeamLogo(comment.teamLogo).then(function (url) {
              comment.teamLogoUrl = url
              return true
            })
          }
        })
        _this.comments = comments
      })
    }
  },
  mounted: function () {
  }
}
</script>

<style lang="scss">
  @import '../../variables.scss';
  .comments {
    overflow-x: hidden;
  }
  .favorite-team {
    margin: -1.8rem auto 0 auto;
  }
  .image.is-64x64 {
    overflow: hidden;
  }
  .avatar {
    border: 2px solid $owp-orange;
    border-radius: 4px;
  }
  .author {
    font-weight: bold;
    margin-bottom: 0!important;
  }
  .new-comment-wrapper {
    .button {
      margin-top: .4rem;
    }
  }
  .content div p {
    margin-top: 0!important;
  }
  p.date {
    margin: -.2rem 0;
    font-size: .7rem;
  }
</style>
