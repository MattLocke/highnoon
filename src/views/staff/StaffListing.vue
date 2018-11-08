<template lang="pug">
  section.staff-listing(@click="setActive")
    h1 Staff Listing
</template>

<script>
export default {
  props: {
    staff: {
      type: Object,
      required: true
    }
  },
  methods: {
    setActive () {
      this.$emit('set-staff', this.staff)
    }
  }
}
</script>
