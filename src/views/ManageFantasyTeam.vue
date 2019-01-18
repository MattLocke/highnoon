<template lang="pug">
  .manage-fantasy-team
    .columns.is-marginless
      left-bar
          section
            collapsible(title-text="Your Bench")
              .left-bar-item Coming Soon
          section
            collapsible(title-text="Pending Trades" :start-collapsed="true")
              .left-bar-item Coming Soon
          section
            collapsible(title-text="Unclaimed Players" :start-collapsed="true")
              .left-bar-item Coming Soon
          section
            collapsible(title-text="Your Schedule")
              .left-bar-item Coming Soon
      .column
        section
          h1 Manage Your Fantasy Team
        section
          h2 League Rosters
        .columns
          .column.is-narrow
            section
              h2 Captain
              .placeholder
          .column
            section
              h2 Active Players
              .columns
                .column
                  .placeholder
                .column
                  .placeholder
                .column
                  .placeholder
                .column
                  .placeholder
                .column
                  .placeholder
                .column
                  .placeholder
</template>

<style lang="scss">
  .placeholder {
    width: 120px;
    height: 200px;
    background-color: rgba(0,0,0,0.7);
  }
</style>
