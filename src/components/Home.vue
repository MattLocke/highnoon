<template lang="pug">
  .home
    section.section
      .container
        .columns
          .column.is-one-quarter-desktop
            current-leagues
            .box
              featured-leagues
            old-leagues
            .box
              h2.overwatch-font.text-border Social Stuff
              p Want to join our awesome community?  Feel free to join us any of the ways found below!
              .columns.is-mobile
                .column.centered
                  a(href="https://discord.gg/H5bNcYD" target="_blank")
                    img.social-icon(src="/assets/img/discord.svg" alt="Discord")
                .column.centered
                  a(href="https://www.reddit.com/r/highnoonpickem" target="_blank")
                    img.social-icon(src="/assets/img/reddit.svg" alt="Reddit")
                .column.centered
                  a(href="https://twitter.com/highnoonpickem" target="_blank")
                    img.social-icon(src="/assets/img/twitter.svg" alt="Twitter")
          .column.is-three-quarters-desktop
            //- .box
              globaltop
            .box
              latest-news
            .box
              a(href="/#/News") View All News
</template>

<script>
import firebase from 'firebase'
import fireUser from '@/services/user'
import currentLeagues from '@/components/home/CurrentLeagues'
import oldLeagues from '@/components/home/OldLeagues'
import globalTop from '@/components/home/GlobalTop'
import latestNews from '@/components/home/LatestNews'
import featuredLeagues from '@/components/league/featuredLeagues'

export default {
  name: 'home',
  components: {
    currentLeagues,
    globalTop,
    latestNews,
    oldLeagues,
    featuredLeagues
  },
  data () {
    return {
      userData: {}
    }
  },
  mounted: function () {
    var _this = this
    // verify user is logged in, set variable accordingly.
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        if (user.emailVerified) _this.isVerified = true
        fireUser.getProfile(user.uid).then(function (userData) {
          _this.userData = userData
        })
      }
    })
  }
}
</script>

<style lang="scss">
  @import '../variables.scss';
  .social-icon {
    height: 2rem;
    width: auto;
  }
</style>
