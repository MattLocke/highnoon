<template lang="pug">
  section.settings
    h2 Your Settings
    .columns
      .column.is-narrow
        b-field(label="Primary Overwatch Role")
          b-select(placeholder="Select Role" v-model="primaryRole")
            option Defense
            option Flex
            option Offense
            option Support
</template>
