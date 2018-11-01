<template lang="pug">
  button.burger(v-bind:class="{ 'open': open }")
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    value: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      open: true
    }
  },
  watch: {
    value: {
      immediate: true,
      handler () {
        this.open = this.value
      }
    }
  },
  methods: {
    toggle () {
      this.open = !this.open
      this.$emit('input', this.open)
    }
  }
}
</script>

<style lang="scss" scoped>
.burger {
  $width: 18px;
  $thickness: 2px;

  border: 0;
  background: none;
  outline: 0;
  padding: 0;
  cursor: pointer;
  color: #fff;

  border-bottom: $thickness solid currentColor;
  width: $width;

  transition: border-bottom 1s ease-in-out;
  -webkit-transition: border-bottom 1s ease-in-out;

  // Fix for extra space in Firefox
  &::-moz-focus-inner {
    border: 0;
    padding: 0;
  }

  &:before {
    content: "";
    display: block;
    border-bottom: $thickness solid currentColor;
    width: 100%;
    margin-bottom: 2px;
    transition: transform 0.5s ease-in-out;
    -webkit-transition: -webkit-transform 0.5s ease-in-out;
  }

  &:after {
    content: "";
    display: block;
    border-bottom: $thickness solid currentColor;
    width: 100%;
    margin-bottom: 2px;
    transition: transform 0.5s ease-in-out;
    -webkit-transition: -webkit-transform 0.5s ease-in-out;
  }

  &.open {
    border-bottom: $thickness solid transparent;
    transition: border-bottom 0.8s ease-in-out;
    -webkit-transition: border-bottom 0.8s ease-in-out;

    &:before {
      transform: rotate(-405deg) translateY(0px) translateX(-2px);
      -webkit-transform: rotate(-405deg) translateY(0px) translateX(-2px);
      transition: transform 0.5s ease-in-out;
      -webkit-transition: -webkit-transform 0.5s ease-in-out;
    }

    &:after {
      transform: rotate(405deg) translateY(-2px) translateX(-2px);
      -webkit-transform: rotate(405deg) translateY(-2px) translateX(-2px);
      transition: transform 0.5s ease-in-out;
      -webkit-transition: -webkit-transform 0.5s ease-in-out;
    }
  }
}
</style>
