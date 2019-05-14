<template lang="pug">
  .select-role.buttons.are-small
    button.button.is-small.locked-button(v-if="locked(`${player.role}1`)")
      eva-icon(name="lock" fill="grey" width="16" height="16" v-tooltip="'This player/role is locked until Monday.'")
      | 1
    button.button.is-small(@click="$emit('setRole', roleData(1))" :class="buttonClass(1)" v-tooltip="tooltipContent(1)" v-else)
      img(:src="`images/roles/${player.role || 'flex'}-white.svg`" width="16" height="16")
      | 1
    button.button.is-small.locked-button(v-if="locked(`${player.role}2`)")
      eva-icon(name="lock" fill="grey" width="16" height="16" v-tooltip="'This player/role is locked until Monday.'")
      | 2
    button.button.is-small(@click="$emit('setRole', roleData(2))" :class="buttonClass(2)" v-tooltip="tooltipContent(2)" v-else)
      img(:src="`images/roles/${player.role || 'flex'}-white.svg`" width="16" height="16")
      | 2
    button.button.is-small.locked-button(v-if="locked('captain')")
      eva-icon(name="lock" fill="grey" width="16" height="16" v-tooltip="'This player/role is locked until Monday.'")
    button.button.is-small(@click="$emit('setRole', roleData('captain'))" :class="buttonClass('captain')" v-tooltip="tooltipContent('captain')" v-else) Cap
</template>

<script>
export default {
  name: 'RoleAssigner',
  props: {
    isLocked: {
      type: Boolean,
      default: false
    },
    lineUp: {
      type: Object,
      required: true
    },
    lockedRoles: {
      type: Array,
      required: true
    },
    player: {
      type: Object,
      required: true
    }
  },
  computed: {
    shortName () {
      return this.player.role.substring(0, 1).toUpperCase()
    }
  },
  methods: {
    buttonClass (pos) {
      const parsedRole = pos === 'captain' ? pos : `${this.player.role}${pos}`
      return this.lineUp[parsedRole] ? { 'is-secondary': true } : { 'is-primary': true }
    },
    locked (pos) {
      // Bugfix edtion return (!isEmpty(this.lineUp[pos]) && this.isLocked) || this.lockedRoles.includes(pos)
      return this.isLocked || this.lockedRoles.includes(pos)
    },
    roleData (pos) {
      const parsedRole = pos === 'captain' ? pos : `${this.player.role}${pos}`
      return {
        player: this.player,
        role: parsedRole
      }
    },
    tooltipContent (pos) {
      const parsedRole = pos === 'captain' ? pos : `${this.player.role}${pos}`
      return this.lineUp[parsedRole] ? `This will replace the current player with <span class='orange'>${this.player.name}</span>` : `This adds <span class='orange'>${this.player.name}</span> to your roster.`
    }
  }
}
</script>

<style lang="scss">
.locked-button {
  cursor: not-allowed;
}
</style>
