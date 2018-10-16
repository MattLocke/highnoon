<template lang="pug">
  .left-bar.column(v-bind:class="getClass()")
    burger.is-pulled-right(v-model="isCollapsed")
    slot(v-if="!isCollapsed")
</template>

<script>
export default {
  data () {
    return {
      isCollapsed: false
    }
  },
  methods: {
    getClass () {
      return this.isCollapsed ? { 'is-narrow': true } : { 'is-one-quarter': true }
    }
  }
}
</script>
