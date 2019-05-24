<template lang="pug">
  .sub-menu.columns
    .column.is-one-fifth.has-text-centered
      .is-light-background
        slot(name="col1")
    .column.is-one-fifth.has-text-centered
      .is-light-background
        slot(name="col2")
    .column.is-one-fifth.has-text-centered
      .is-light-background
        slot(name="col3")
    .column.is-one-fifth.has-text-centered
      .is-light-background
        slot(name="col4")
    .column.is-one-fifth.has-text-centered
      .is-light-background
        slot(name="col5")
</template>

<script>
export default {
  name: 'SubMenu'
}
</script>
