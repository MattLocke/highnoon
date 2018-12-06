<template lang="pug">
  .pickem
    section
      button.is-pulled-right.button.is-primary(@click="$emit('cancel')") Cancel
      h1 Create Pick'em League
    .columns
      //- .column.is-one-quarter
        section
          h2 League Image
          p Please select the image to use.  Image should be jpg/png and 256x256.  (This can be changed/selected later)
          hr
          picture-input(ref="pictureInput", width="250", height="250", accept="image/jpeg,image/png", buttonClass="button is-primary is-small", @change="uploadPicture")
      .column
        section
          h2 League Name
          b-input(placeholder="league name" v-model="league.leagueName")
        section
          h2 Password Protect League
          .columns
            .column.is-narrow
              b-switch(v-model="passwordProtected")
            .column
              b-input(placeholder="password" v-if="passwordProtected" v-model="league.password")
        section
          h2 Social Links
          p Do you or your organization have social media accounts?  Enter their links below!
          .columns.is-multiline
            .column.is-narrow
              b-field(label="Discord")
                b-input(v-model="league.discord")
            .column.is-narrow
              b-field(label="Instagram")
                b-input(v-model="league.instagram")
            .column.is-narrow
              b-field(label="Reddit")
                b-input(v-model="league.reddit")
            .column.is-narrow
              b-field(label="Twitter")
                b-input(v-model="league.twitter")
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
      league: {
        leagueName: null,
        leagueImageUrl: null,
        password: null,
        passwordProtected: false,
        discord: null,
        instagram: null,
        reddit: null,
        twitter: null
      },
      passwordProtected: false,
      leagueImage: null
    }
  },
  computed: {
    ownerId () {
      return this.$store.getters.getUserId
    },
    canCreateLeague () {
      return this.league.leagueName
    }
  },
  methods: {
    // uploadPicture () {
    //   console.log('New picture selected.')
    //   if (this.$refs.pictureInput.file) {
    //     this.fileExtension = `.${this.$refs.pictureInput.fileType.substr(this.$refs.pictureInput.fileType.indexOf('/') + 1)}`
    //   } else {
    //     console.error('FileReader API not supported.  Boo.')
    //   }
    // },
    createLeague () {
      // build the league data
      const leagueData = {
        ...this.league,
        passwordProtected: this.passwordProtected
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
