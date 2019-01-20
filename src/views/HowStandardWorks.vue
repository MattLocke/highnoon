<template lang="pug">
  .how-standard-works.container
    section
      h1 How It Works
      p There has been a litany of questions regarding how Fantasy Overwatch will work on High Noon.  Some great questions, some not-so-great questions.  I've broken down the most common ones and decided to write this "How It Works" page to hopefully help answer some of these questions.  As always, if you have any additional questions, please hit me up on Discord!
    section
      h2 The Points System
      p This part was actually tremendously difficult.  In traditional fantasy systems there are tons of stats available from the respective sports to help in crafting an incredibly in-depth fantasy experience.  When it comes to Overwatch, we are at best limited in terms of the data we have available to us.  So what I did was pour over all publicly available data points and tried to come up with something that makes sense.  Will this formula change?  Perhaps.  But more on that in the "Our Promise To You" section.
      p After looking over everything, I came up with the idea that in terms of a base data point to determine contribution towards a match result, you don't really get much better than hitpoint exchange.  Damage dealers remove hitpoints.  Supports add hitpoints.  Tanks block hitpoints.  Of course these roles venture into one anothers territory and contribute, but usually when they do, it's usually hitpoint related.  Unfortunately, Blizzard doesn't provide blocking stats (yet).  This kind of puts us in a weird position, but for now we'll just have to roll with it.  Another big factor is eliminations.  Especially at the professional level, an elimination is the catalyst of the entire team collapsing.  So with these two factors in mind, here's how scoring works.
      .box
        span 1 point per 1000 Hitpoints Removed + 1 point per 1000 Hitpoints Added + .5 points per elimination.
      p So let's take one of the league MVPs and use his average stats as an example.
      .box
        span (6,814 / 1000) + (6,256 / 1000) + (14 / 2) = 19.845 points
      p Initially I had a system that would provide benefits to offset roles like tanks, but after talking with DeathBlow and others involved with fantasy sports, it seems more favorable to have a formula that's fairly easy to calculate so a user can more easily gauge a value of a player to their team.
    section
      h2 League Requirements
      p The league requirements are fairly simple, but I wanted to make sure users were aware of why certain things behave the way they do and answer some common questions.
      h3.orange How many people can be in a draft league?
      span 12.
      h3.orange Does the number of members have to be even?
      span Yes.  We don't want byes in the league.
      h3.orange Can I be in more than 8 leagues at a time?
      span Yes, but you have to be a patron through Patreon.  Being in leagues adds significant reads/writes to the database and can get quite expensive, so instead of drowning myself in debt, I put the limit to help guard against having to shut it down!
      h3.orange Can I be in more than one live draft at a time?
      span Yes, but you will have to have multiple instances (tabs) open at the same time.
      h3.orange Can I start a league mid-season?
      span Yes.  League creations can happen at any team.  However, points for that league will not start until the following week.  We would recommend you start at the beginning of the next stage if you can.
    section
      h2 The Draft
      p This is by far one of the best parts of the fantasy system, and I would absolutely encourage being in the same discord voice channel as the rest of your drafting buddies, as it will greatly increase the quality of fun to be had!  Here is a quick overview of how the draft will flow:
      .box
        ul
          li 1. League Owner starts the draft
          li 2. Users are taken to a lobby where the pick order is randomized to start.
          li 3. A player will use the filters to quickly find a player they want, and add that player.
          li 4. The system will then cycle to the next person in line, using a snake pattern.
          li 5. Once all of the rosters are full, you will be directed to your team management page.
      p If a player is unable to attend the live draft, they may set up a preference list and the system will auto-draft for them.
    section
      h2 Preference List
      p When you are a member of a standard draft league, you will be able to create a preference list.  If you choose to, the list can auto-draft for you, giving preference to unfulfilled roles, then once all required roles are filled, it will work from top to bottom.  If all of your preference list has been chosen by other members of the draft, the system will then select a random available player and add them to your team.  You do not have to be present or even have a browser open for this feature to work.
    section
      h2 Your Team
      p Once the draft is complete, you will be redirected to your team management page.  This page will let you determine your team composition, as well as a team captain.  A team captain's points will count like any other member of your team would, the only difference being you can select a player from any role to be your captain.
      p You will also be able to request trades from other players as well as from the remaining player pool, so staying active in your league is a must!
    section
      h2 The Schedule
      p The schedule will show you who your matchups are on a week-by-week basis.  Each week you will be matched up with a random opponent, and at the end of the week the user with the most points from the sum of all their players performance will get a win.  League leaderboards will sort users by wins.  If you have a player that plays more than once in a week, that players BEST score will be used for that week.
    section
      h2 Our Promise To You
      p One of the worst things that could be done would be major rules/points changes mid-stage that could potentially alter your teams potential.  With that in mind I would like to make this promise to you our points system and general rules WILL NOT EVER CHANGE MID-STAGE.  If a change does come between stages, the changes will be opt-in on a per-league basis, so the league owner can determine if they want to use the new or old changes.  By creating a more predictable system, players can invest time in their draft picks and pick with confidence.
</template>

<style lang="scss">
  .how-standard-works {
    .box {
      background-color: rgba(0,0,0,0.5);
      margin: 1rem;
    }
    h3 {
      margin-top: 1rem;
    }
    hr {
      margin-top: .25rem;
    }
  }
</style>
