<template lang="pug">
  section.convert-to-featured
    collapsible(title-text="Convert To Featured" :start-collapsed="true")
      p Converts a league so it can be featured on the featured leagues page. It will need an image, so you can
        a(href="/#/upload" target="_blank")  click here
        |  to upload one!
      b-field(label="League Image URL")
        b-input(type="text" v-model="featureURL")
      b-field(label="Featured Message")
        b-input(maxlength="1000" type="textarea" v-model="featureMessage")
      b-field
        button.button.is-primary(@click="updateFeatured") {{ league.featuredURL ? 'Revoke' : 'Convert' }}
</template>

<script>
import LeagueService from '@/services/league'

export default {
  name: 'ConvertToFeatured',
  props: {
    league: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      featureURL: '',
      featureMessage: ''
    }
  },
  watch: {
    league: {
      immediate: true,
      handler (val) {
        if (val) {
          this.featureURL = val.featuredURL
        }
      }
    }
  },
  methods: {
    updateFeatured () {
      this.$store.dispatch('setLoading', true)
      LeagueService.makeFeatured(this.league.leagueType, this.league.id, this.featureURL, this.featureMessage)
        .then(() => {
          window.location.reload()
        })
    }
  }
}
</script>
