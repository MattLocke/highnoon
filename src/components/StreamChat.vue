<template lang="pug">
  .stream-chat
    section.section
      .container
        .columns.is-desktop
          .column.is-two-thirds-desktop
            .box
              iframe(src='https://player.twitch.tv/?channel=overwatchleague', height='410', width='100%', frameborder='none', scrolling='none', allowfullscreen='true', security='restricted')
          .column.is-one-third-desktop
            .box
              .chat-wrapper
                h2.text-border Live Chat 
                  span.orange-text for 
                  | {{ leagueData.name }}
                #messages-wrapper
                  .chat-message(v-for="chatItem in messages")
                    p(v-bind:class="{'isOwner': userData.id === chatItem.userId}")
                      b {{ chatItem.displayName }}
                      |  - {{ chatItem.message }}
        .columns.is-desktop
          .column.is-one-third-desktop.is-hidden-mobile
            .box
              h3.overwatch-font This feature is in alpha!
              p We'll be adding all sorts of fun things to this chat (emoticons, team logos, etc) but we wanted you to have a taste of it before the offical launch.  Please enjoy and feel free to leave feedback on our subreddit or discord.  Thank you!
          .column.is-one-third-desktop.is-hidden-mobile
            .box
              h3.overwatch-font Stats
              p Feel free to check out the stats for all the teams here. Soon we'll be adding current match stats and other fun things!
              a.button.positive-button(href="/#/Stats") View All Stats
          .column.is-one-third-desktop
            .box(v-if="userData.id")
              textarea.textarea(placeholder="Your Message", v-model="message", v-on:keyup.13="sendMessage()")
              .spacer
              button.button.positive-button(v-on:click="sendMessage()", type="button") Send Message
</template>

<script>
  import firebase from 'firebase'
  import {fireInit} from '@/helpers/firebase-helper'
  import fireStreamChat from '@/services/streamchat'
  import fireLeague from '@/services/league'

  export default {
    name: 'streamChat',
    data () {
      return {
        message: '',
        leagueId: '',
        messages: [],
        leagueData: ''
      }
    },
    computed: {
      userData: function () {
        return this.$store.getters.getUserData
      },
      isOwner: function () {
        return this.leagueData.ownerId === this.userData.id
      }
    },
    methods: {
      sendMessage: function () {
        if (this.message) {
          var _this = this
          var payload = {}
          payload.message = this.message
          payload.displayName = this.userData.displayName
          payload.teamLogo = this.userData.teamLogo || 'none'
          payload.userId = this.userData.id
          payload.postDate = Math.round(Date.now() / 1000)

          fireStreamChat.sendMessage(this.leagueId, this.userData.id, payload).then(function () {
            _this.message = ''
          })
        } else {
          _this.message = ''
        }
      },
      updateScroll: function () {
        var out = document.getElementById('messages-wrapper')
        // var isScrolledToBottom = out.scrollHeight - out.clientHeight <= out.scrollTop + 1
        console.log(out.scrollHeight - out.clientHeight, out.scrollTop + 1)
        // if (isScrolledToBottom) out.scrollTop = out.scrollHeight - out.clientHeight
        out.scrollTop = 928755
      }
    },
    watch: {
      messages: function () {
        var _this = this
        setTimeout(function () {
          _this.updateScroll()
        }, 250)
      }
    },
    mounted: function () {
      var _this = this
      fireInit()
      var db = firebase.database()
      this.leagueId = this.$route.params.leagueId

      db.ref('/streamChats/' + this.leagueId).orderByChild('postDate').limitToLast(20).on('child_added', function (snapshot, prevChildKey) {
        var newPost = snapshot.val()
        _this.messages.push(newPost)
      })

      fireLeague.getLeagueById(_this.leagueId).then(function (data) {
        _this.leagueData = data.data
      })
    }
  }
</script>

<style lang="scss" scoped>
  @import '../variables.scss';
  .chat-wrapper {
    min-height: 416px;
  }
  #messages-wrapper {
    overflow: auto;
    height: 360px;
  }
  .isOwner {
    color: $owp-ltblue;
  }
</style>