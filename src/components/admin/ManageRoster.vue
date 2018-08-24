<template lang="pug">
  .manage-roster
    h2 Manage Roster
    .box
      p Manage the roster
      .field
        label.label(for="comp_id") Comp Id
        .control
          select.select.is-large#comp_id(v-model="compId" v-on:change="getTeams()")
            option(v-for="comp in competitions" v-bind:value="comp.id") {{ comp.name }}
      .field
          label.label(for="team") Team
          .control
            select#team.select.is-large(v-model="team" v-on:change="setTeamData()")
              option(v-for="owTeam in teams", v-bind:value="owTeam") {{ owTeam.name }}
      h3 Roster:
      .columns.is-desktop
        .column
          input.input(v-model="newPlayer.player")
        .column
          input.input(v-model="newPlayer.realName")
        .column
          .select
            select.is-full-width(v-model="newPlayer.role")
              option(value="flex") flex
              option(value="support") support
              option(value="dps") dps
              option(value="tank") tank
        .column
          a.button.positive-button(v-on:click="addPlayer") Add Player
      table.table.is-fullwidth.is-striped.owp-orange-border
          thead
            tr
              th Handle
              th Name
              th Role
              th &nbsp;
          tbody
            tr(v-for="(player, index) in roster")
              td {{ player.player }}
              td {{ player.realName }}
              td {{ player.role }}
              td
                a.button.negative-button(v-on:click="deletePlayer(index)") Delete
      a.button.positive-button(v-on:click="updateRoster()" v-bind:class="{'is-loading': isLoading}") Update Roster
</template>

<script>
import fireComp from '@/services/competition'
import fireTeam from '@/services/team'

export default {
  name: 'manage-roster',
  data () {
    return {
      compId: '',
      teamId: '',
      competitions: [],
      team: [],
      teams: [],
      roster: [],
      newPlayer: {
        player: '',
        realName: '',
        role: 'flex'
      },
      isLoading: false
    }
  },
  methods: {
    updateRoster: function () {
      var _this = this
      if (this.teamId && this.roster.length) {
        this.isLoading = true
        fireTeam.updateRoster(this.teamId, this.roster).then(function () {
          _this.isLoading = false
        })
      }
    },
    getTeams: function () {
      var _this = this
      if (this.compId) {
        this.isLoading = true
        fireTeam.getTeams(this.compId).then(function (teams) {
          _this.teams = teams
          _this.isLoading = false
        })
      }
    },
    addPlayer: function () {
      this.roster.push(this.newPlayer)
      this.newPlayer = {
        player: '',
        realName: '',
        role: 'flex'
      }
    },
    deletePlayer: function (index) {
      this.roster.splice(index, 1)
    },
    setTeamData: function () {
      this.teamId = this.team.id
      this.roster = this.team.roster
    },
    getCompetitions: function () {
      var _this = this
      fireComp.getCompetitions().then(function (comps) {
        _this.competitions = comps
      })
    }
  },
  mounted: function () {
    this.getCompetitions()
  }
}
</script>
