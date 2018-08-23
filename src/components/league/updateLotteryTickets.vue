<template lang="pug">
  .update-lottery-tickets
    h3.overwatch-font Update Tickets
    
</template>

<script>
  import fireLeague from '@/services/league'
  export default {
    name: 'toggleLottery',
    props: [
      'leagueData',
      'leagueId'
    ],
    data () {
      return {
        
      }
    },
    methods: {
    }
  }
</script>

<style scoped>
  .tgl + .tgl-btn {
    width: 6rem;
  }
</style>