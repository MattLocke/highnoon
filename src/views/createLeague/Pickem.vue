<template lang="pug">
  .pickem
    .mockup
      h1 Pick'em Mode
    section
      h2 League Name
      b-input(placeholder="league name")
    section
      h2 Password Options
      p Would you like to password protect this league?
      b-switch
    section
      h2 League Image
      p Please select the image to use
    section
      button.button.is-positive Create League
</template>
