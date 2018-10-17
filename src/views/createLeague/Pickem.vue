<template lang="pug">
  .pickem
    .mockup
      h1 Pick'em Mode
    section
      h2 League Name
      b-input(placeholder="league name" v-model="leagueName")
    section
      h2 Password Options
      p Would you like to password protect this league?
      b-switch(v-model="passwordProtected")
      b-input(placeholder="password" v-if="passwordProtected" v-model="password")
    section
      h2 League Image
      p Please select the image to use.  Image should be jpg/png and 256x256.  (This can be changed/selected later)
      picture-input(ref="pictureInput", width="250", height="250", accept="image/jpeg,image/png", buttonClass="button is-primary is-small", @change="uploadPicture")
    section
      button.button.is-primary Create League
</template>

<script>
import PictureInput from 'vue-picture-input'

export default {
  components: {
    PictureInput
  },
  data () {
    return {
      fileExtension: null,
      leagueName: null,
      ownerId: this.$store.state.user.fireUserData.uid,
      passwordProtected: false,
      leagueImage: null,  
      password: null
    }
  },
  methods: {
    uploadPicture () {
      console.log('New picture selected.')
      if (this.$refs.pictureInput.file) {
        this.fileExtension = `.${this.$refs.pictureInput.fileType.substr(this.$refs.pictureInput.fileType.indexOf("/") + 1)}`
        console.table(this.$refs.pictureInput)
      } else {
        console.error('FileReader API not supported.  Boo.')
      }
    },
  }
}
</script>
