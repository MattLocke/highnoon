<template lang="pug">
  .create-league
    .box(v-if="numLeagues < 4")
      h1 Create League
      hr
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
    .box(v-else)
      p I'm sorry, looks like you're all out of leagues!  Feel free to
        a(href="#")  support me through patreon
        |  to have unlimited leagues!

      //- ul
        li Password Protect
        li Locked
        li View Ticket Distribution
        li Invite Link
        li Remove User
        li Delete League
        li League Image (512x512)
</template>

<script>
export default {
  computed: {
    numLeagues () {
      return 2
    }
  }
}
</script>
