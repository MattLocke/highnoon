<template lang="pug">
  .wrap.hamburger-menu
    eva-icon.has-pointer(name="more-horizotnal" fill="white" @click="isOpen = !isOpen")
    .dropdown.is-up(:class="{'is-active': isOpen }" @click="isOpen = !isOpen")
      .dropdown-menu(role="menu")
        .dropdown-content
          a.dropdown-item(v-for="(menuItem, index) in menuItems" @click="menuItem.linkFn" :key="index") {{ menuItem.linkText }}
</template>

<script>
export default {
  name: 'HamburgerMenu',
  props: {
    menuItems: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isOpen: false
    }
  }
}
</script>
