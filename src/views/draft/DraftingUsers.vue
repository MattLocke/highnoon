<template lang="pug">
  .drafting-users(v-if="playersLoaded")
    .columns.is-multiline.is-mobile(v-if="users")
      .column.is-one-fifth-desktop.is-half-mobile(v-for="(theUser, index) in users")
        h3.hide-overflow.underlined(:class="{'orange': users[draft.activeDrafter] && theUser.userId == users[draft.activeDrafter].userId && !draftComplete}")
          eva-icon(name="star" fill="white" width="16" height="16" v-if="theUser.userId == ownerId" v-tooltip="'League Owner'")
          | {{ theUser.displayName }}
          span.is-pulled-right(v-if="users[draft.activeDrafter].userId && theUser.userId == users[draft.activeDrafter].userId && !draftComplete") {{ draft.direction == 'forward' ? '>' : '<' }}
        player-card(v-for="pick in getUserPicks(theUser.userId)" :key="playersObject[pick].id" :player="playersObject[pick]" :showRemove="false" :primaryColor="getColor(playersObject[pick])" :score="playersObject[pick].stats.fantasyScore || 0" :hidePhoto="true") {{ playersObject[pick].name }}
</template>

<script>
import { isEmpty } from 'lodash'

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
    ownerId: {
      type: String,
      default: ''
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
    players () {
      return Object.values(this.$store.getters.getPlayers)
    },
    playersLoaded () {
      return !isEmpty(this.players)
    },
    playersObject () {
      return this.$store.getters.getPlayers
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
