<template lang="pug">
  .delete-league
    h3.overwatch-font Delete This League
    p Deleting this league will remove all points / picks / users and probably make some people very sad.  Only do this when you're absolutely sure!
    button.button.positive-button(v-if="isSure" v-on:click="deleteLeague()") Are you ABSOLUTELY sure?
    button.button.negative-button(v-else v-on:click="seeIfSure()") Delete League
</template>

<script>
import fireLeague from '@/services/league'

export default {
  props: [
    'leagueId'
  ],
  components: {
    'confirm': confirm
  },
  data () {
    return {
      isSure: false
    }
  },
  methods: {
    seeIfSure: function () {
      this.isSure = true
    },
    deleteLeague: function () {
      fireLeague.deleteLeague(this.leagueId, this.$router)
    }
  }
}
</script>
