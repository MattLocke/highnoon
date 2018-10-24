<template lang="pug">
  .pickem
    .mockup
      h1 Pick'em Mode
    hr
    .columns
      .column.is-one-quarter
        section
          h2 League Image
          p Please select the image to use.  Image should be jpg/png and 256x256.  (This can be changed/selected later)
          hr
          picture-input(ref="pictureInput", width="250", height="250", accept="image/jpeg,image/png", buttonClass="button is-primary is-small", @change="uploadPicture")
      .column.is-three-quarters
        section
          h2 League Name
          b-input(placeholder="league name" v-model="leagueName")
        section
          h2 Password Protect League
          b-switch(v-model="passwordProtected")
          .wrap(v-if="passwordProtected")
            hr
            b-input(placeholder="password" v-if="passwordProtected" v-model="password")
    section
      button.button.is-primary(@click="createLeague" v-if="canCreateLeague") Create League
      button.button.is-primary(disabled v-else) Create League
</template>

<script>
import PictureInput from 'vue-picture-input'

import LeagueService from '@/services/league'

export default {
  components: {
    PictureInput
  },
  data () {
    return {
      fileExtension: null,
      leagueName: null,
      passwordProtected: false,
      leagueImage: null,
      password: null
    }
  },
  computed: {
    ownerId () {
      return this.$store.getters.getUserId
    },
    canCreateLeague () {
      return (this.leagueName && this.leagueImage)
    }
  },
  methods: {
    uploadPicture () {
      console.log('New picture selected.')
      if (this.$refs.pictureInput.file) {
        this.fileExtension = `.${this.$refs.pictureInput.fileType.substr(this.$refs.pictureInput.fileType.indexOf('/') + 1)}`
      } else {
        console.error('FileReader API not supported.  Boo.')
      }
    },
    createLeague () {
      // build the league data
      const leagueData = {
        leagueName: this.leagueName,
        ownerId: this.ownerId,
        passwordProtected: this.passwordProtected,
        password: this.password
      }

      this.$store.dispatch('setLoading', true)
      LeagueService.createLeague(leagueData, 'pickem')
        .then((leagueId) => {
          this.$store.dispatch('setLoading', false)
          if (leagueId) this.$router.push({ path: `/ViewLeague/${this.leagueId}` })
          // show an error or something if it no workie.
        })
        .catch(() => {
          this.$store.dispatch('setLoading', false)
          // some kind of error message here as well.
        })
    }
  }
}
</script>
