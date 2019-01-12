<template lang="pug">
  .collapsible
    h2.has-pointer(@click="showContent = !showContent") {{ titleText }}
      arrow(:isLeft="true" v-model="showContent")
    slot(v-if="showContent")
</template>

<script>
export default {
  name: 'Collapsible',
  props: {
    startCollapsed: {
      type: Boolean,
      default: false
    },
    titleText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      showContent: false
    }
  },
  mounted () {
    this.showContent = !this.startCollapsed
  }
}
</script>
