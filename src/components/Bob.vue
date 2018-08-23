<template lang="pug">
  .bob
    section.section
      .container
        .box
          h2 Match Data
          table.table.is-fullwidth.is-striped.owp-orange-border
            thead
              tr
                th Home
                th Away
                th Date
                th ID
                th Status
            tbody
              tr(v-for="match in sortedMatches")
                td {{ match.homeTeamName }}
                td {{ match.awayTeamName }}
                td {{ match.startDate | formatDate }}
                td {{ match.id }}
                td {{ getStatus(match.isLocked) }}
</template>

<script>
  import fireMatch from '@/services/match'

  export default {
    name: 'bob',
    data () {
      return {
        matches: [],
        // compId: 'zlMYK0WJUwz3N2TB7Q57'
        compId: 'gleuqAnpFrtKZo2zpjmu'
      }
    },
    computed: {
      sortedMatches: function () {
        return this.matches.sort(function (a, b) { return (a.startDate < b.startDate) ? 1 : ((b.startDate < a.startDate) ? -1 : 0) })
      }
    },
    methods: {
      getStatus: function (locked) {
        return (locked ? 'Locked' : 'Active')
      }
    },
    mounted: function () {
      var _this = this
      fireMatch.getAllLeagueMatches(_this.compId).then(function (matches) {
        _this.matches = matches
      })
    }
  }
</script>

<style lang="scss">
  @import '../variables.scss';
</style>