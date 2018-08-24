<template lang="pug">
  .profile
    section.section
      .container
        .notification.is-danger(v-if="errorMessage")
        .box(v-if="!profileId")
          h1.title.text-border Profile for {{ profile.displayName }}
          .columns
            .column
              .existing(v-if="!updateAvatarMode")
                img.existing-profile(v-bind:src="profileImage" v-if="profileImage")
                .wrap
                  button.button.positive-button.is-small(v-on:click="updateAvatarMode = true") Update Avatar
              .new-avatar.centered(v-if="updateAvatarMode")
                picture-input(ref="pictureInput", width="250", height="250", accept="image/jpeg", size=".1", buttonClass="button negative-button", @change="uploadPicture", v-if="updateAvatarMode")
                .wrap
                  p Max size: 256x256 or 100Kb
                  button.button.positive-button.is-small(v-on:click="updateAvatarMode = false") Cancel
            .column
              .field
                label.label Battle Net ID
                input.input(v-model="profile.battleNet", placeholder="BattleNet Id", v-bind:class="{'is-danger': !isValid(profile.battleNet), 'is-success': isValid(profile.battleNet)}")
              .field
                label.label Discord ID
                input.input(v-model="profile.discord", placeholder="Discord Name", v-bind:class="{'is-danger': !isValid(profile.discord), 'is-success': isValid(profile.discord)}")
            .column
              figure(v-if="teamLogo").image.is-128x128.is-pulled-right
                img(v-bind:src="teamLogo")
              label.label Your Team Logo
              .select
                select.is-large(v-model="profile.teamLogo", v-on:change="getLogo(profile.teamLogo)")
                  option(value="") No Team Logo
                  option(v-for="team in teams", v-bind:value="team.logo") {{ team.name }}
              p This will appear under your avatar when making comments/etc!
              label.checkbox
                input(type="checkbox" v-model="backgroundColor")
                |  Set the background color to my team color!
              p(v-if="refreshProfile") After applying, be sure to refresh the page!
          .box(v-if="profile.isWriter || profile.isEditor || profile.isAdmin")
            label.label News Signature
            input.input(v-model="profile.signature")
          hr
          button.button.positive-button(v-on:click="updateProfile()", v-bind:class="{'is-loading': isLoading}") Save Your Profile
          p(v-if="resultMessage") {{ resultMessage }}
          .spacer
          .box
            h2 Messages
            .spacer
            message-box(:message='{}' :isOwner='true' :userData='user')
        .box(v-else)
          h1.title.text-border Public profile
            span.orange-text for
            | {{ profile.displayName }}
          p Battle.net: {{ profile.battleNet || 'N/A' }}
          p Discord: {{ profile.discord || 'N/A' }}
          hr
          //- leave-message(:theirId="profile.id")

</template>

<script>
import firebase from 'firebase'
import fireUser from '@/services/user'
import fireTeam from '@/services/team'
import fireImage from '@/services/image'
import gravatar from '@/services/gravatar'
import PictureInput from 'vue-picture-input'
import MessageBox from '@/components/profile/MessageBox'
import LeaveMessage from '@/components/profile/LeaveMessage'

export default {
  name: 'profile',
  components: {
    PictureInput,
    MessageBox,
    LeaveMessage
  },
  data () {
    return {
      profile: {},
      profileImage: '',
      user: {},
      resultMessage: '',
      errorMessage: '',
      isLoading: false,
      teams: [],
      teamLogo: '',
      backgroundColor: '',
      refreshProfile: false,
      updateAvatarMode: false,
      profileId: ''
    }
  },
  watch: {
    backgroundColor: function () {
      var _this = this
      if (this.backgroundColor) {
        _this.updateBackgroundColor()
      } else {
        _this.profile.backgroundColor = null
      }
    }
  },
  methods: {
    uploadPicture: function () {
      // Nothing for now
    },
    isValid: function (theValue) {
      if (theValue) {
        var tmp = theValue.split('#')
        if (parseInt(tmp[1]).toString().length === 4) {
          return true
        } else return false
      } else return false
    },
    fixProfile: function () {
      var _this = this
      this.isLoading = true
      if (!this.profile.lifetimePoints) this.profile.lifetimePoints = 0
      if (!this.profile.id) this.profile.id = this.user.uid
      fireUser.createProfile(this.profile).then(function (data) {
        _this.isLoading = false
      })
    },
    getTeams: function () {
      var _this = this
      fireTeam.getAllTeams().then(function (teams) {
        _this.teams = teams
      })
    },
    getLogo: function (logo) {
      var _this = this
      if (logo) {
        fireImage.getTeamLogo(logo).then(function (url) {
          _this.teamLogo = url
          if (_this.backgroundColor) _this.updateBackgroundColor()
        })
      }
    },
    updateBackgroundColor: function () {
      var _this = this
      _this.teams.forEach(function (team) {
        if (team.logo === _this.profile.teamLogo) {
          _this.profile.backgroundColor = team.color
          _this.refreshProfile = true
        }
      })
    },
    updateProfile: function () {
      var _this = this
      _this.isLoading = true
      var imageName = _this.user.uid + '.jpg'
      if (_this.updateAvatarMode) {
        fireImage.uploadImage('users', imageName, _this.$refs.pictureInput.file).then(function (response) {
          if (response) {
            _this.profile.avatar = imageName
            fireUser.updateProfile(_this.profile, _this.user.uid).then(function (result) {
              _this.resultMessage = 'Successfully updated your profile!'
              _this.isLoading = false
            })
          }
        })
      } else {
        fireUser.updateProfile(_this.profile, _this.user.uid).then(function (result) {
          _this.resultMessage = 'Successfully updated your profile!'
          _this.isLoading = false
        })
      }
    }
  },
  mounted: function () {
    var _this = this
    this.profileId = this.$route.params.profileId
    _this.getTeams()
    if (!this.profileId) {
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          _this.user = user
          // populate user profile
          fireUser.getProfile(user.uid).then(function (profile) {
            if (!profile.gravatar) {
              profile.gravatar = gravatar.getProfilePic(profile.email, 128)
            }
            if (profile.avatar) {
              fireImage.getImage('users', user.uid + '.jpg').then(function (response) {
                _this.profileImage = response
              })
            }
            if (profile.backgroundColor) _this.backgroundColor = true
            if (profile.teamLogo) _this.getLogo(profile.teamLogo)
            _this.profile = profile
          })
        }
      })
    } else {
      fireUser.getProfile(this.profileId).then(function (profile) {
        if (profile.avatar) {
          fireImage.getImage('users', _this.profileId + '.jpg').then(function (response) {
            _this.profileImage = response
          })
        }
        if (profile.teamLogo) _this.getLogo(profile.teamLogo)
        _this.profile = profile
      })
    }
  }
}
</script>

<style>
  .existing-profile {
    width: 128px;
    height: 128px;
  }
</style>
