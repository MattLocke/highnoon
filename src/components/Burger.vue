<template lang="pug">
  .hamburger
    #hamburger.hamburglar.small-burger(v-bind:class="{ 'is-open': open, 'is-closed': !open }" v-on:click="toggle()")
      .burger-icon
        .burger-container
          span.burger-bun-top
          span.burger-filling
          span.burger-bun-bot
      .burger-ring
        svg.svg-ring
          path.path(fill='none', stroke='#333', stroke-miterlimit='10', stroke-width='4', d='M 34 2 C 16.3 2 2 16.3 2 34 s 14.3 32 32 32 s 32 -14.3 32 -32 S 51.7 2 34 2')
      svg(width='0', height='0')
        mask#mask
          path(xmlns='http://www.w3.org/2000/svg', fill='none', stroke='#ff0000', stroke-miterlimit='10', stroke-width='4', d='M 34 2 c 11.6 0 21.8 6.2 27.4 15.5 c 2.9 4.8 5 16.5 -9.4 16.5 h -4')
      .path-burger
        .animate-path
          .path-rotation
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    'starts-open': {
      type: Boolean,
      required: false,
      default: false
    },
    'value': {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      open: false
    }
  },
  watch: {
    value () {
      if (this.value) this.open = true
      else this.open = false
    }
  },
  mounted () {
    if (this.startsOpen) this.open = true
    else this.open = false
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
$color: #fff;
$blue: transparent;
$animation: 0.6s;
$base: 30px;
$half: 15px;

#hamburger, #hamburger:before, #hamburger:after, #hamburger-company, #hamburger-subscription, #hamburger-product, #hamburger-user {
  box-sizing: border-box;
  cursor: pointer;
}

.hamburglar {
  position: relative;
  display: block;
  width: $base;
  height: $base;
  background: $blue;
  -webkit-touch-callout: none;
  user-select: none;
  cursor: pointer;
}

.small-burger {
  transform: scale(0.3);
}

// transition mask
.path-burger {
  position: absolute;
  top: 0;
  left: 0;
  height: $base;
  width: $base;
  // two masks because... browser support.
  mask: url(#mask);
  -webkit-mask-box-image: url(https://raygun.io/upload/mask.svg);
}

.animate-path {
  position: absolute;
  top: 0;
  left: 0;
  width: $base;
  height: $base;
}

// what this does is create a small square that I then rotate behind an svg mask, giving the apparence of the line animating
.path-rotation {
  height: $half;
  width: $half;
  margin: $half $half 0 0;
  transform: rotate(0deg);
  transform-origin: 100% 0;
  &:before {
    content: '';
    display: block;
    width: $half;
    height: $half;
    margin: 0 4px 0 0;
    background: $color;
  }
}

// box rotation animation
@keyframes rotate-out {
  0% {
    transform: rotate(0deg);
  }
  40% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes rotate-in {
  0% {
    transform: rotate(360deg);
  }
  40% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

// offset moves
// dasharray is the dash size
// need to be able to control dash space size.

.hamburglar.is-open {
  .path {
    animation: dash-in $animation linear normal;
    animation-fill-mode:forwards;
  }
  .animate-path {
    animation: rotate-in $animation linear normal;
    animation-fill-mode:forwards;
  }
}

.hamburglar.is-closed {
  .path {
    animation: dash-out $animation linear normal;
    animation-fill-mode:forwards;
  }
  .animate-path {
    animation: rotate-out $animation linear normal;
    animation-fill-mode:forwards;
  }
}

.path {
  stroke-dasharray: 240;
  stroke-dashoffset: 240;
  stroke-linejoin: round;
}

@keyframes dash-in {
  0% {
    stroke-dashoffset: 240;
  }
  40% {
    stroke-dashoffset: 240;
  }
  100% {
    stroke-dashoffset: 0;
  }
}
@keyframes dash-out {
  0% {
    stroke-dashoffset: 0;
  }
  40% {
    stroke-dashoffset: 240;
  }
  100% {
    stroke-dashoffset: 240;
  }
}
// All good burgers need filling!

.burger-icon {
  position: absolute;
  padding: 20px 16px;
  height: $base;
  width: $base;
}

.burger-container {
  position: relative;
  height: 28px;
  width: 36px;
}

.burger-bun-top,
.burger-bun-bot,
.burger-filling {
  position: absolute;
  display: block;
  height: 4px;
  width: 36px;
  border-radius: 2px;
  background: $color;
}

.burger-bun-top {
  top: 0;
  transform-origin: $half 2px;
}

.burger-bun-bot {
  bottom: 0;
  transform-origin: $half 2px;
}
//.burger-filling {
//  @include transition(all,($animation/2.5),ease-in-//out);
//}
// relative parent is the button
.burger-filling {
  top: 12px;
}

// burger ring container
.burger-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: $base;
  height: $base;
}

.svg-ring {
  width: $base;
  height: $base;
}

// bun animations
.hamburglar.is-open {
  .burger-bun-top {
    animation: bun-top-out $animation linear normal;
    animation-fill-mode:forwards;
  }
  .burger-bun-bot {
    animation: bun-bot-out $animation linear normal;
    animation-fill-mode:forwards;
  }
}
.hamburglar.is-closed {
  .burger-bun-top {
    animation: bun-top-in $animation linear normal;
    animation-fill-mode:forwards;
  }
  .burger-bun-bot {
    animation: bun-bot-in $animation linear normal;
    animation-fill-mode:forwards;
  }
}

@keyframes bun-top-out {
  0% {
    left: 0;
    top: 0;
    transform: rotate(0deg);
  }
  20% {
    left: 0;
    top: 0;
    transform: rotate(15deg);
  }
  80% {
    left: -5px;
    top: 0;
    transform: rotate(-60deg);
  }
  100% {
    left: -5px;
    top: 1px;
    transform: rotate(-45deg);
  }
}

@keyframes bun-bot-out {
  0% {
    left: 0;
    transform: rotate(0deg);
  }
  20% {
    left: 0;
    transform: rotate(-15deg);
  }
  80% {
    left: -5px;
    transform: rotate(60deg);
  }
  100% {
    left: -5px;
    transform: rotate(45deg);
  }
}

@keyframes bun-top-in {
  0% {
    left: -5px;
    bot: 0;
    transform: rotate(-45deg);
  }
  20% {
    left: -5px;
    bot: 0;
    transform: rotate(-60deg);
  }
  80% {
    left: 0;
    bot: 0;
    transform: rotate(15deg);
  }
  100% {
    left: 0;
    bot: 1px;
    transform: rotate(0deg);
  }
}

@keyframes bun-bot-in {
  0% {
    left: -5px;
    transform: rotate(45deg);
  }
  20% {
    left: -5px;
    bot: 0;
    transform: rotate(60deg);
  }
  80% {
    left: 0;
    bot: 0;
    transform: rotate(-15deg);
  }
  100% {
    left: 0;
    transform: rotate(0deg);
  }
}

// burger filling
.hamburglar.is-open {
  .burger-filling {
    animation: burger-fill-out $animation linear normal;
    animation-fill-mode:forwards;
  }
}

.hamburglar.is-closed {
  .burger-filling {
    animation: burger-fill-in $animation linear normal;
    animation-fill-mode:forwards;
  }
}

@keyframes burger-fill-in {
  0% {
    width: 0;
    left: 36px;
  }
  40% {
    width: 0;
    left: 40px;
  }
  80% {
    width: 36px;
    left: -6px;
  }
  100% {
    width: 36px;
    left: 0px;
  }
}

@keyframes burger-fill-out {
  0% {
    width: 36px;
    left: 0px;
  }
  20% {
    width: 42px;
    left: -6px;
  }

  40% {
    width: 0;
    left: 40px;
  }

  100% {
    width: 0;
    left: 36px;
  }
}
</style>
