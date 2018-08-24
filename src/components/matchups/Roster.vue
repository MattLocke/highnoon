<template lang="pug">
  .roster
    h2.text-border
      img.logo(v-bind:src="logoUrl")
      |  {{ teamInfo.name }}
    .columns.is-multiline
      .column.is-narrow(v-for="player in sortedRoster")
        article.media
          figure.media-left
            p.image.is-32x32
              img(v-bind:src="roleUrl(player.role)")
          .media-content
            .content
              h4.overwatch-font {{ player.player }}
</template>

<script>
import fireTeam from '@/services/team'

export default {
  name: 'roster',
  props: ['teamId', 'logoUrl'],
  data () {
    return {
      teamInfo: []
    }
  },
  methods: {
    roleUrl: function (role) {
      return '/assets/img/roles/' + role + '.svg'
    }
  },
  watch: {
    teamId: function () {
      var _this = this
      fireTeam.getTeamById(this.teamId).then(function (teamInfo) {
        _this.teamInfo = teamInfo
      })
    }
  },
  computed: {
    sortedRoster: function () {
      if (this.teamInfo.roster) return this.teamInfo.roster.sort((a, b) => a.role > b.role)
      else return [{player: 'No Roster Info Available', role: 'flex'}]
    }
  },
  mounted: function () {
    var _this = this
    if (this.teamId) {
      fireTeam.getTeamById(this.teamId).then(function (teamInfo) {
        _this.teamInfo = teamInfo
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .logo {
    height: 1.8rem;
    width: auto;
    margin-bottom: -.1rem;
  }
  .media-left p {
    padding-top: 0;
    margin-top: 0;
    img {
      fill: blue;
    }
  }
  h4 {
    padding-top: .6rem;
  }
</style>
