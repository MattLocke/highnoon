<template lang="pug">
  .draft-preference
    .columns
      left-bar(:showClose="false")
        h2 Draft Preference List
        section
          h3 Chosen Roles
          .columns
            .column.has-text-centered
              .big-number
                img(src="images/roles/offense-white.svg" alt="offense")
                | {{ chosenOffense }}
            .column.has-text-centered
              .big-number
                img(src="images/roles/support-white.svg" alt="support")
                | {{ chosenSupport }}
            .column.has-text-centered
              .big-number
                img(src="images/roles/tank-white.svg" alt="tank")
                | {{ chosenTank }}
            .column.has-text-centered
              .big-number
                img(src="images/roles/flex-white.svg" alt="flex")
                | {{ chosenFlex }}
        section
          .columns
            .column
              button.button.is-primary Save List
            .column.has-text-right
              span 1/100
        .left-bar-item
          .columns.is-gapless.is-mobile
            .column.is-narrow
              img(:src="`images/roles/offense-white.svg`")
            .column.is-narrow
              img(src="/images/teams/WAS.svg")
            .column
              span Striker
            .column.is-narrow
              span.is-proper 139
      .column
        .container
          h2 Choose from the players below
          section
            h3 Choose Your Player
          section
            .columns
              .column.is-narrow
                b-field(label="Filter Team")
                  b-select(placeholder="Filter By Team" v-model="filterTeam")
                    option(value="") All
                    option(v-for="team in teams" :value="team.abbreviatedName") {{ team.name }}
              .column.is-narrow
                b-field(label="Filter Role")
                  b-select(placeholder="Filter By Role" v-model="filterRole")
                    option(value="") All
                    option(value="flex") Flex
                    option(value="offense") Offense
                    option(value="support") Support
                    option(value="tank") Tank
            b-field(label="Filter Players")
              b-input(type="text" v-model="filterText")
          section
            player-line(:player="player" :key="`${Math.random()}${player.id}`" v-for="player in filteredPlayers" @add-player="addToRoster($event)" :canSelect="canSelect(player)" :roster="roster")
</template>

<script>
export default {
  data () {
    return {
      chosenOffense: 0,
      chosenSupport: 0,
      chosenTank: 0,
      chosenFlex: 0
    }
  }
}
</script>
