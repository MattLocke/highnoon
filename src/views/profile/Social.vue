<template lang="pug">
  section.social
    h2 Social Settings
    .columns
      .column.is-narrow
        b-field(label="Battle.net")
          b-input(v-model="battleNet")
      .column.is-narrow
        b-field(label="Discord")
          b-input(v-model="discord")
      .column.is-narrow
        b-field(label="Reddit")
          b-input(v-model="reddit")
</template>

<script>
export default {
  data () {
    return {
      battleNet: '',
      discord: '',
      reddit: ''
    }
  }
}
</script>
