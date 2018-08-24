<template lang="pug">
  .featured
    section.section
      .container
        .box
          h1.text-border Featured Leagues
            button.button.positive-button.is-pulled-right(v-if="userData.isAdmin && !createFeatureMode", v-on:click="createFeatureMode = true") Create Feature
          p These are leagues that are open to the public, have fun prizes, and offer you the chance to compete with many people.  Good luck!
          hr
          a.button.positive-button(v-if="!showOfficial" v-on:click="showOfficial = true") Show Official Team Leagues
          a.button.negative-button(v-else v-on:click="showOfficial = false") Show All Featured Leagues
          .spacer
          p(v-if="showOfficial") Your team not listed below?  Be sure to ask them about it on discord and we'll see if we can help them start a league!
          .box(v-if="createFeatureMode")
            .columns
              .column.is-one-quarter-desktop
                .control
                  picture-input(ref="pictureInput", width="250", height="250", accept="image/png", buttonClass="button negative-button", @change="uploadPicture")
              .column.is-three-quarters-desktop
                .control
                  label.label Choose League
                  autocomplete(:source="leagues" @selected="setLeagueData")
                  p League Name: {{ newFeature.leagueName }} ({{ newFeature.leagueId }})
                .control
                  label.label League Summary
                  textarea.textarea(rows="4" v-model="newFeature.description")
                hr
                button.button.positive-button(v-on:click="saveFeature()") Save Featured League
          .box(v-for="(league, index) in featuredLeagues" v-if="showLeague(league)")
            article.media
              figure.media-left.is-hidden-mobile
                p.image.is-128x128
                  img.league-image(v-bind:src="league.imageUrl")
              .media-content
                .content
                  h2.text-border {{ league.leagueName }}
                  span.overwatch-font {{ league.competitionName }}
                  span.overwatch-font.orange-text  - {{ league.leagueType }}
                  p {{ league.description }}
                  a.button.positive-button(v-bind:href="joinLeagueUrl(league.leagueId)") View / Join
                  a.button.negative-button.is-pulled-right(v-on:click="deleteFeature(league.id, index)" v-if="userData.isAdmin") Delete

</template>

<script>
import PictureInput from 'vue-picture-input'
import firebase from 'firebase'
import fireFeature from '@/services/feature'
import fireImage from '@/services/image'
import fireLeague from '@/services/league'
import fireUser from '@/services/user'
import autocomplete from 'vuejs-auto-complete'

export default {
  name: 'featured',
  components: {
    PictureInput,
    autocomplete
  },
  data () {
    return {
      newFeature: {
        leagueName: '',
        leagueId: '',
        leagueOwnerId: '',
        leagueOwnerName: '',
        leagueType: '',
        competitionId: '',
        competitionName: '',
        description: '',
        icon: ''
      },
      showOfficial: false,
      fileStuff: '',
      featuredLeagues: [],
      leagues: [],
      createFeatureMode: false,
      userData: {}
    }
  },
  watch: {
    createFeatureMode: function () {
      var _this = this
      if (this.createFeatureMode) {
        fireLeague.getAllLeagues().then(function (leagues) {
          _this.leagues = leagues
        })
      }
    }
  },
  methods: {
    showLeague: function (league) {
      if (this.showOfficial && league.isOfficial) return true
      else if (this.showOfficial && !league.isOfficial) return false
      else return true
    },
    uploadPicture: function () {
      console.log('New picture selected.')
      if (this.$refs.pictureInput.file) {
        console.log('Picture loaded.')
      } else {
        console.error('FileReader API not supported.  Boo.')
      }
    },
    joinLeagueUrl: function (leagueId) {
      return '/#/ViewLeague/' + leagueId
    },
    deleteFeature: function (featureId, index) {
      var _this = this
      fireFeature.deleteFeature(featureId).then(function (result) {
        _this.featuredLeagues.splice(index, 1)
      })
    },
    saveFeature: function () {
      // save the picture
      var imageName = this.newFeature.icon
      var _this = this
      fireImage.uploadImage('features', imageName, this.$refs.pictureInput.file).then(function (response) {
        if (response) {
          // save the rest
          fireFeature.createFeature(_this.newFeature).then(function (response) {
            if (response) {
              // clear the feature, hide the option.
              fireImage.getImage('features', imageName).then(function (ref) {
                if (ref) _this.newFeature.imageUrl = ref
                _this.featuredLeagues.unshift(_this.newFeature)
                _this.clearFeature()
                _this.createFeatureMode = false
              })
            }
          })
        }
      })
    },
    clearFeature: function () {
      this.newFeature = {
        leagueName: '',
        leagueId: '',
        leagueOwnerId: '',
        leagueOwnerName: '',
        leagueType: '',
        competitionId: '',
        competitionName: '',
        description: '',
        icon: ''
      }
    },
    setLeagueData: function (info) {
      var league = info.selectedObject
      this.newFeature.leagueName = league.name
      this.newFeature.leagueId = league.docId
      this.newFeature.leagueOwnerId = league.ownerId
      this.newFeature.leagueOwnerName = league.ownerDisplayName
      this.newFeature.leagueType = this.getLeagueMode(league.simpleMode)
      this.newFeature.competitionId = league.competitionId
      this.newFeature.competitionName = league.competitionName
      this.newFeature.icon = league.docId + '.png'
    },
    getLeagueMode: function (trueFalse) {
      if (trueFalse) return 'Simple Mode'
      else return 'Standard Mode'
    }
  },
  mounted: function () {
    var _this = this
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        fireUser.getProfile(user.uid).then(function (info) {
          _this.userData = info
        })
      }
      fireFeature.getFeatures().then(function (features) {
        features.forEach(function (feature) {
          feature.imageUrl = ''
          fireImage.getImage('features', feature.icon).then(function (url) {
            if (url) feature.imageUrl = url
          })
        })
        _this.featuredLeagues = features
      })
    })
  }
}
</script>

<style scoped>
  h2 {
    margin-bottom: 0;
  }
  .media-left p {
    padding-top: 0;
    margin-top: 0;
  }
  .league-image {
    border: 2px solid #222;
    border-radius: 4px;
  }
</style>
