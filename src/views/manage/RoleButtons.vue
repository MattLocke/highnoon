<template lang="pug">
  .select-role.buttons.are-small
    button.is-primary.button.is-small(@click="$emit('setRole', roleData(1))")
      img(:src="`images/roles/${player.attributes.role || 'flex'}-white.svg`" width="16" height="16")
      | 1
    button.is-primary.button.is-small(@click="$emit('setRole', roleData(2))")
      img(:src="`images/roles/${player.attributes.role || 'flex'}-white.svg`" width="16" height="16")
      | 2
    button.is-primary.button.is-small(@click="$emit('setRole', roleData('captain'))") Cap
</template>

<script>
export default {
  name: 'RoleAssigner',
  props: {
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
    roleData (pos) {
      const parsedRole = pos === 'captain' ? pos : `${this.player.attributes.role}${pos}`
      return {
        player: this.player,
        role: parsedRole
      }
    }
  }
}
</script>
