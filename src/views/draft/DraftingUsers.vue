<template lang="pug">
  .drafting-users
    .columns.is-multiline.is-mobile(v-if="users")
      .column.is-one-fifth-desktop.is-half-mobile(v-for="(theUser, index) in users")
        h3.hide-overflow.underlined(:class="{'orange': theUser.userId == users[draft.activeDrafter].userId && !draftComplete}") {{ theUser.displayName }}
          span.is-pulled-right(v-if="theUser.userId == users[draft.activeDrafter].userId && !draftComplete") {{ draft.direction == 'forward' ? '>' : '<' }}
        player-card(v-for="pick in getUserPicks(theUser.userId)" :key="pick.id" :player="pick" :showRemove="false" :primaryColor="getColor(pick)" :score="pick.stats.fantasyScore || 0" :hidePhoto="true") {{ pick.name }}
</template>

<script>
import PlayerCard from '@/components/PlayerCard'

export default {
  name: 'DraftingUsers',
  components: {
    PlayerCard
  },
  props: {
    draft: {
      type: Object,
      required: true
    },
    picks: {
      type: [Array, Object],
      required: true
    },
    users: {
      type: Array,
      required: true
    },
    activeDrafter: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    teams () {
      return this.$store.getters.getTeams
    },
    draftComplete () {
      return this.draft.status === 'completed'
    },
    user () {
      return this.$store.getters.getUserData
    }
  },
  methods: {
    getUserPicks (userId) {
      return this.picks[userId] || []
    },
    getColor (player) {
      const team = this.teams ? this.teams.filter(team => team.abbreviatedName === player.team)[0] : null
      if (team) return team.primaryColor === '000000' ? team.secondaryColor : team.primaryColor
      return '222'
    }
  }
}
</script>

<style lang="scss">
  h3.hide-overflow {
    height: 1.8rem;
    overflow: hidden;
  }
</style>
