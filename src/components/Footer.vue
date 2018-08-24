<template lang="pug">
  .footer
    .container
      .columns
        .column.is-one-third-desktop
          h4.overwatch-font.text-border This site is in beta
          p Things could be a bit wonky, stuff may freak you out a bit at times.  It's going to be a fun ride while we grow and add features and make this even more enjoyable.  Thank you for being a part of this community!
          p Please report any bugs/feature requests on our discord, located at:
            a(href="https://discord.gg/H5bNcYD") https://discord.gg/H5bNcYD
          P Want to see what I'm working on?  Visit my
            a(href="https://trello.com/b/vYZNcNxV" target="_blank") Trello board!
        .column.is-one-third-desktop
          h4.overwatch-font.text-border Useful Links
          ul.useful-links
            li
              a(href="https://overwatchleague.com") Overwatch League
            li
              a(href="https://www.overwatchcontenders.com") Overwatch Contenders
            li
              a(href="https://www.winstonslab.com") Winstons Lab

        .column.is-one-third-desktop
          h4.overwatch-font.text-border Support The Dev
          p I'm Matt Locke, the developer who created High Noon Pick'em. A hell of a lot pizza, coffee and time went into building the app so far. High Noon Pick'em will always be free, but if you want to help a starving dev buy more pizza and coffee (and server usage), you can click below!
          a.button.positive-button(href="https://www.patreon.com/highnoonpickem") Become a Patron
          p Or
            a(href="https://paypal.me/mattlocke/5" target="_blank") buy me a cup of coffee
            | !
    hr
    p.copyright.is-pulled-right ©2017 Matt Locke | Locke LLC
</template>

<script>
</script>

<style lang="scss" scoped>
  .copyright {
    font-size: .7rem;
  }
  .useful-links {
    margin: 0;
    li {
      list-style: none;
      padding: .4rem 0;
      margin: .4rem 0;
      font-size: 1.2rem;
    }
  }
</style>
