<template lang="pug">
  section.section.add-staff
    h1 Add Staff Member
    hr
    .columns
      .column.is-one-quarter-desktop
        picture-input(ref="pictureInput", width="250", height="250", accept="image/jpeg,image/png", buttonClass="button is-primary is-small", @change="uploadPicture")
      .column.is-three-quarters-desktop
        .columns
          .column.is-narrow
            .field
              label.label First Name
              .control
                input.input(type="text" v-model="staffMember.firstName")
          .column.is-narrow
            .field
              label.label Last Name
              .control
                input.input(type="text" v-model="staffMember.lastName")
          .column.is-narrow
            .field
              label.label Handle
              .control
                input.input(type="text" v-model="staffMember.handle")
        .columns
          .column.is-narrow
            .field
              label.label Position
              .control
                input.input(type="text" v-model="staffMember.position")
          .column.is-narrow
            .field
              label.label Favorite Character
              .control
                input.input(type="text" v-model="staffMember.favoriteCharacter")
        .field
          label.label Bio
          .control
            textarea.textarea(v-model="staffMember.bio")
        hr
        .field
          .control
            button.button.is-primary Add Staff Member
            button.button.is-pulled-right(@click="$emit('cancel')") Cancel
</template>

<script>
import PictureInput from 'vue-picture-input'

export default {
  name: 'AddStaffMember',
  components: {
    PictureInput
  },
  data () {
    return {
      staffMember: {
        handle: '',
        firstName: '',
        lastName: '',
        position: '',
        bio: '',
        picture: '',
        favoriteCharacter: ''
      },
      fileExtension: ''
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
    }
  }
}
</script>
