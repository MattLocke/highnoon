<template lang="pug">
  .arrow.is-pulled-right
    svg(viewBox='0 0 50 80', xml:space='preserve' v-if="isLeft" :class="{'clicked': isClicked}")
      polyline(fill='none', stroke='#FFFFFF', stroke-width='5', stroke-linecap='round', stroke-linejoin='round', points='\
      45.63,75.8 0.375,38.087 45.63,0.375 ')
    svg(xmlns='http://www.w3.org/2000/svg', xmlns:xlink='http://www.w3.org/1999/xlink', viewBox='0 0 50 80', xml:space='preserve' v-if="isRight")
      polyline(fill='none', stroke='#FFFFFF', stroke-width='5', stroke-linecap='round', stroke-linejoin='round', points='\
      0.375,0.375 45.63,38.087 0.375,75.8 ')
</template>

<script>
export default {
  name: 'Arrow',
  props: {
    isLeft: {
      type: Boolean,
      default: false
    },
    isRight: {
      type: Boolean,
      default: false
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isClicked: false
    }
  },
  watch: {
    value: {
      immediate: true,
      handler () {
        this.isClicked = this.value
      }
    }
  },
  methods: {
    toggle () {
      this.isClicked = !this.isClicked
      this.$emit('input', this.isClicked)
    }
  }
}
</script>

<style lang="scss">
  .arrow {
    display: inline-block;
    cursor: pointer;
    svg {
      height: 1rem;
    }
    .clicked {
      transform: rotate(-90deg);
    }
  }
</style>
