<template lang="pug">
  .control-panel
    h3 Site Control Panel
    p Use this only when something bad is happening.  It should be obvious when that is.
    .columns.is-mobile
      .column.is-narrow
        b-switch(v-model="liveConfigCopy.canCreateUnlimitedRoster")
      .column
        span Can Create Unlimited Roster
    .columns.is-mobile
      .column.is-narrow
        b-switch(v-model="liveConfigCopy.canPick")
      .column
        span Can Place Pickems
    .columns.is-mobile
      .column.is-narrow
        b-switch(v-model="liveConfigCopy.canStartDraft")
      .column
        span Can Start Standard Draft
    .columns.is-mobile
      .column.is-narrow
        b-switch(v-model="liveConfigCopy.canTrade")
      .column
        span Can Trade Players
    .columns.is-mobile
      .column.is-narrow
        b-switch(v-model="liveConfigCopy.canWaiverWire")
      .column
        span Free Agent Trading Open
    .columns.is-mobile
      .column.is-narrow
        b-switch(v-model="liveConfigCopy.waiverWireDisabled")
      .column
        span Waiver Wire Active
    .columns.is-mobile
      .column.is-narrow
        b-switch(v-model="liveConfigCopy.canUseSite")
      .column
        span Can Use High Noon
    .columns.is-mobile
      .column.is-narrow
        button.button.is-small.is-primary(@click="forceRefresh") Force Refresh
      .column
        span Force Refresh
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'

export default {
  name: 'adminControlPanel',
  data () {
    return {
      liveConfigCopy: {
        canPick: false
      }
    }
  },
  computed: {
    liveConfig () {
      return this.$store.getters.getLiveConfig
    },
    userData () {
      return this.$store.getters.getUserData
    }
  },
  watch: {
    liveConfig: {
      immediate: true,
      handler (val) {
        this.liveConfigCopy = { ...val }
      }
    },
    liveConfigCopy: {
      deep: true,
      handler (newVal, oldVal) {
        this.saveConfig()
      }
    }
  },
  methods: {
    forceRefresh () {
      console.log('forcing refresh...')
      this.liveConfigCopy.restart = Date.now()
    },
    saveConfig () {
      firebase.database().ref('liveConfig').update(this.liveConfigCopy)
    }
  }
}
</script>
