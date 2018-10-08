<template lang="pug">
  .compose-message
    section
      hr
      b-field(vertical label="Message")
        b-input(type="textarea")
      b-field(vertical)
        p.control
          button.button.is-primary Send Message
</template>

<style lang="scss">
  .compose-message {
    position: fixed;
    bottom: 0;
    width: 70vw;
    padding-bottom: 2rem;
  }
</style>
