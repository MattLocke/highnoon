<template lang="pug">
  .faq
    section.section
      .container.hoverable
        .box
          h1.text-border Frequently Asked Questions
          p Not sure what the point of the site is, or how it works?  Hopefully we cover those questions here!  If not, please join us on discord!
        .box
          h2 What does pick'em mean?
          p Pick'em is a term for a style of fantasy where your points are based on match predition instead of player performance.  I chose this style of fantasy because we don't have all the data available to do a proper fantasy league with player drafts.  One day that may be a different story!
        .box
          h2 How does the points system work?
          p Points are awarded based on accuracy.  To help simplify things I've tried to indicate where points come from when placing your picks.  Simple mode caps out at 500 per match, and Standard caps out at 1000 points per match.
        .box
          h2 When do the picks become locked?
          p The picks will lock 30 minutes before match start time.  Due to server/cron weirdness, I'd make sure you place them at least 40 minutes before the match begins to be safe!  I had to change it to 30 minutes because OWL seems to start early if they can.
        .box
          h2 Are there any prizes?
          p THere are in featured leagues!  Featured leagues will provide you with prizes and fame beyond your wildest dreams!  Be sure to check out that page!
        .box
          h2 Is there a limit to how many people can be in my league?
          p For now it's 25.  If you need more, please hit me up on our Discord server!
        .box
          h2 Where is my confirmation email?
          p Sometimes google can be a bit slow.  Unfortunately there's not much I can do about it.  If you have waited 30 minutes or more, please hit me up!
        .box
          h2 Why can I pick one team to win, but still pick the other team to win all the maps?
          p I did this because it gives opportunity to play the odds, and try to maximize points.  It creates more opportunity to save points if you're not confident in your pick.  Good luck!
</template>

<script>
  export default {
    name: 'FAQ',
    data () {
      return {
      }
    },
    methods: {
    },
    mounted: function () {
    }
  }
</script>

<style scoped>
</style>