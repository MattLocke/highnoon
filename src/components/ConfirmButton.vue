<template lang="pug">
  .confirm-button
    a.button(:class="customClasses" v-show="!sure" v-on:click="sure = true") {{ buttonText }}
    a.button(:class="customClasses" v-show="sure" v-on:click="confirmDelete()") {{ confirmText }}
</template>

<script>
export default {
  name: 'confirmButton',
  props: {
    customClasses: {
      type: Object,
      default: () => ({ 'is-primary': true })
    },
    theId: {
      type: String,
      default: null
    },
    buttonText: {
      type: String,
      default: 'Delete'
    },
    confirmText: {
      type: String,
      default: 'Confirm'
    }
  },
  data () {
    return {
      sure: false
    }
  },
  methods: {
    confirmDelete: function () {
      this.sure = false
      this.$emit('confirm-it', this.theId)
    }
  }
}
</script>
