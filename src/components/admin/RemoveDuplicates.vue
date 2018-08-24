<template lang="pug">
  .remove-duplicates
    h2 Remove Duplicates
    button.button.positive-button(v-bind:class="{'is-loading': isLoading}" v-on:click="removeDuplicates()") Remove duplicates
    p(v-if="isDone") Duplicates removed.
</template>

<script>
import maintenance from '@/services/maintenance'

export default {
  name: 'remove-duplicates',
  data () {
    return {
      isLoading: false,
      isDone: false
    }
  },
  methods: {
    removeDuplicates: function () {
      var _this = this
      _this.isLoading = true
      // go through matchPicks, get matchId and userId
      maintenance.removeDuplicates().then(function () {
        _this.isDone = true
        _this.isLoading = false
      })
    }
  }
}
</script>
