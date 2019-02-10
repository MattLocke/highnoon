<template lang="pug">
  .select-role.buttons.are-small
    button.button.is-small(@click="$emit('setRole', roleData(1))" :class="buttonClass(1)" v-tooltip="tooltipContent(1)")
      img(:src="`images/roles/${player.attributes.role || 'flex'}-white.svg`" width="16" height="16")
      | 1
    button.button.is-small(@click="$emit('setRole', roleData(2))" :class="buttonClass(2)" v-tooltip="tooltipContent(2)")
      img(:src="`images/roles/${player.attributes.role || 'flex'}-white.svg`" width="16" height="16")
      | 2
    button.button.is-small(@click="$emit('setRole', roleData('captain'))" :class="buttonClass('captain')" v-tooltip="tooltipContent('captain')") Cap
</template>

<script>
export default {
  name: 'RoleAssigner',
  props: {
    lineUp: {
      type: Object,
      required: true
    },
    player: {
      type: Object,
      required: true
    }
  },
  computed: {
    shortName () {
      return this.player.attributes.role.substring(0, 1).toUpperCase()
    }
  },
  methods: {
    buttonClass (pos) {
      const parsedRole = pos === 'captain' ? pos : `${this.player.attributes.role}${pos}`
      return this.lineUp[parsedRole] ? { 'is-secondary': true } : { 'is-primary': true }
    },
    roleData (pos) {
      const parsedRole = pos === 'captain' ? pos : `${this.player.attributes.role}${pos}`
      return {
        player: this.player,
        role: parsedRole
      }
    },
    tooltipContent (pos) {
      const parsedRole = pos === 'captain' ? pos : `${this.player.attributes.role}${pos}`
      return this.lineUp[parsedRole] ? `This will replace the current player with <span class='orange'>${this.player.name}</span>` : `This adds <span class='orange'>${this.player.name}</span> to your roster.`
    }
  }
}
</script>
