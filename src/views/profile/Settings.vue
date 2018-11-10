<template lang="pug">
  section.settings
    h2 Your Settings
    .columns
      .column.is-narrow
        b-field(label="Overwatch Role")
          b-select(placeholder="Select Role" v-model="primaryRole")
            option Defense
            option Flex
            option Offense
            option Support
      .column.is-narrow
        b-field(label="Receive Emails")
          b-checkbox Yes I'd like emails.
</template>
