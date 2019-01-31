<template lang="pug">
  section.news-image-uploader
    picture-input(ref="newsPictureInput", width="800", height="250", accept="image/jpeg,image/png", size=".3", buttonClass="button is-primary" @change="setImageChosen")
    button.button.is-primary(@click="uploadNewsPicture" :disabled="!hasImage") Upload News Picture
    hr
    h2 Previous Uploads
    b-table(
      :data="existingImages"
      ref="newsImages"
      :paginated="existingImages.length > 10"
      :per-page="10")
      template(slot-scope="props")
        b-table-column(label="Image Name" sortable)
          span {{ props.row.imageName }}
        b-table-column(label="Uploaded")
          span {{ props.row.currentTime | formatJSDate }}
        b-table-column(width="60")
          button.button.is-primary.is-small(@click="copyLink(props.row.downloadURL)") Copy Link
</template>

<script>
import PictureInput from 'vue-picture-input'

import ImageService from '@/services/image'

export default {
  components: {
    PictureInput
  },
  data () {
    return {
      existingImages: [],
      hasImage: false
    }
  },
  mounted () {
    this.listImages()
  },
  methods: {
    copyLink (link) {
      this.$copyText(link)
        .then(() => {
          this.$toast.open({
            message: 'Successfully copied the link!',
            type: 'is-success',
            position: 'is-bottom'
          })
        })
        .catch((e) => {
          console.log(e)
        })
    },
    listImages () {
      ImageService.getImageListings('news')
        .then((images) => {
          this.existingImages = Object.values(images)
        })
    },
    setImageChosen (data) {
      this.hasImage = !!(data.length)
    },
    uploadNewsPicture () {
      this.$store.dispatch('setLoading', true)
      const theFile = this.$refs.newsPictureInput.file
      console.table(theFile)

      ImageService.uploadImage('news', theFile.name, theFile)
        .then((response) => {
          console.table(response)
          if (response) {
            // save it to the db so we can get a list of them
            console.log('Uploaded everything!')
          }
        })
    }
  }
}
</script>
