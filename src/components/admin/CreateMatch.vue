<template lang="pug">
  .create-match
    h2 Create Match
    .box
      .form
        .field
          label.label(for="comp_id") Comp Id
          .control
            select.select.is-large#comp_id(v-model="match.compId" v-on:change="refreshTeams()")
              option(v-for="comp in competitions" v-bind:value="comp.id") {{ comp.name }}
        .field
          label.label(for="home_team") Home Team
          .control
            select#home_team.select.is-large(v-model="match.homeTeamId" v-on:change="setHomeTeam()")
              option(v-for="owTeam in teams", v-bind:value="owTeam.id") {{ owTeam.name }}
        .field
          label.label(for="away_team") Away Team
          .control
            select#away_team.select.is-large(v-model="match.awayTeamId" v-on:change="setAwayTeam()")
              option(v-for="owTeam in teams", v-bind:value="owTeam.id") {{ owTeam.name }}
        .field
          label.label(for="start_time") Start Date &amp; Time
          .control
            select.select.is-large(v-model="time.year")
              option(selected) 2018
            select.select.is-large(v-model="time.month")
              option 01
              option 02
              option 03
              option 04
              option 05
              option 06
              option 07
              option 08
              option 09
              option 10
              option 11
              option 12
            select.select.is-large(v-model="time.day")
              option 01
              option 02
              option 03
              option 04
              option 05
              option 06
              option 07
              option 08
              option 09
              option 10
              option 11
              option 12
              option 13
              option 14
              option 15
              option 16
              option 17
              option 18
              option 19
              option 20
              option 21
              option 22
              option 23
              option 24
              option 25
              option 26
              option 27
              option 28
              option 29
              option 30
              option 31
            |
            select.select.is-large(v-model="time.hour")
              option 12
              option 13
              option 14
              option 15
              option 16
              option 17
              option 18
              option 19
              option 20
              option 21
              option 22
              option 23
              option 24
            select.select.is-large(v-model="time.minute")
              option 00
              option 15
              option 30
              option 45
        .field(v-for="(map, index) in match.maps")
          label.label {{ map.type }}
          .select
            select(v-model="match.maps[index].name")
              option(v-for="mapName in mapsNames") {{ mapName }}
        .field
          label.label Stage
          .select
            select(v-model="match.stage")
              option Stage 1
              option Stage 2
              option Stage 3
              option Stage 4
              option Playoffs
        .field
          label.label Week
          .select
            select(v-model="match.week")
              option Week 1
              option Week 2
              option Week 3
              option Week 4
              option Week 5

        button.button.positive-button(v-on:click="createMatch()") Create Match
      .message(v-if="message")
        p {{ message }}
</template>

<script>
import fireMatch from '@/services/match'
import fireTeam from '@/services/team'
import fireComp from '@/services/competition'

export default {
  name: 'create-match',
  data () {
    return {
      showCreateMatch: false,
      competitions: [],
      time: {
        year: '2018',
        month: '07',
        day: '11',
        hour: '18',
        minute: '00'
      },
      mapsNames: [
        'Hanamura',
        'Horizon Lunar Colony',
        'Temple of Anubis',
        'Volskaya Industries',
        'Dorado',
        'Junkertown',
        'Route 66',
        'Watchpoint: Gibraltar',
        'Eichenwalde',
        'Hollywood',
        'King\'s Row',
        'Numbani',
        'Blizzard World',
        'Ilios',
        'Lijiang Tower',
        'Nepal',
        'Oasis'
      ],
      teams: [],
      match: {
        compId: 'ALI8o0eJ30V1D1Fb7rHV',
        homeTeamId: '',
        homeTeamName: '',
        homeTeamShortName: '',
        awayScore: '0',
        homeScore: '0',
        awayTeamId: '',
        awayTeamName: '',
        awayTeamShortName: '',
        isLocked: false,
        startDate: '',
        matchWinner: '',
        numMaps: 4,
        stage: '',
        maps: [
          {
            type: 'Escort',
            winner: '',
            score: '',
            name: 'Watchpoint: Gibraltar'
          },
          {
            type: 'Control',
            winner: '',
            score: '',
            name: 'Lijiang Tower'
          },
          {
            type: 'Hybrid',
            winner: '',
            score: '',
            name: 'Blizzard World'
          },
          {
            type: 'Assault',
            winner: '',
            score: '',
            name: 'Horizon Lunar Colony'
          },
          {
            type: 'Escort',
            winner: '',
            score: '',
            name: 'Watchpoint: Gibraltar'
          }
        ]
      },
      message: null,
      errorMessage: null
    }
  },
  computed: {
    matchTime: function () {
      // 2017-12-07 18:00:00
      var dateString = this.time.year + '-' + this.time.month + '-' + this.time.day + ' ' + this.time.hour + ':' + this.time.minute + ':00'
      // + 28800
      return Math.round((parseInt(new Date(dateString).getTime()) + 28800) / 1000)
    }
  },
  methods: {
    getCompetitions: function () {
      var _this = this
      fireComp.getCompetitions().then(function (comps) {
        _this.competitions = comps
      })
    },
    setHomeTeam: function () {
      var _this = this
      console.log('Setting home team...')
      if (_this.match.homeTeamId) {
        _this.teams.forEach(function (team) {
          if (team.id === _this.match.homeTeamId) {
            _this.match.homeTeamName = team.name
            _this.match.homeTeamShortName = team.shortName
            _this.match.homeTeamLogo = team.logo
          }
        })
      }
    },
    setAwayTeam: function () {
      var _this = this
      console.log('Setting away team...')
      if (_this.match.awayTeamId) {
        _this.teams.forEach(function (team) {
          if (team.id === _this.match.awayTeamId) {
            _this.match.awayTeamName = team.name
            _this.match.awayTeamShortName = team.shortName
            _this.match.awayTeamLogo = team.logo
          }
        })
      }
    },
    createMatch: function () {
      var _this = this
      _this.setHomeTeam()
      _this.setAwayTeam()
      _this.match.startDate = _this.matchTime
      fireMatch.createMatch(_this.match).then(function (id) {
        _this.message = 'Created ' + _this.match.homeTeamName + ' vs ' + _this.match.awayTeamName
      })
    },
    refreshTeams: function () {
      var _this = this
      if (this.match.compId) {
        fireTeam.getTeams(this.match.compId).then(function (teams) {
          _this.teams = teams
        })
      }
    }
  },
  mounted: function () {
    this.refreshTeams()
    this.getCompetitions()
  }
}
</script>
