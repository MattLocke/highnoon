<template lang="pug">
  .create-team
    h2 Create Team
    .box
      form
        .field
          label.label(for="comp_id") Comp Id
          .control
            input.input#comp_id(placeholder="Comp Id", type="text", class="validate", v-model="team.compId")
        .field
          label.label(for="team_name") Team Name
          .control
            input.input#team_name(placeholder="Team Name", type="text", class="validate", v-model="team.name")
        .field
          label.label(for="short_name") Team Short Name
          .control
            input.input#short_name(placeholder="Team Short Name", type="text", class="validate", v-model="team.shortName")
        .field
          label.label(for="team_logo") Logo
          .control
            input.input#team_logo(placeholder="Logo", type="text", class="validate", v-model="team.logo")
        button.button.positive-button(v-on:click="createTeam") Create Team
      .message(v-if="message")
        p {{ message }}
</template>

<script>
  import fireTeam from '@/services/team'

  export default {
    name: 'create-team',
    data () {
      return {
        showCreateTeam: false,
        team: {
          compId: 'ALI8o0eJ30V1D1Fb7rHV',
          logo: '',
          losses: 0,
          mapWins: 0,
          name: '',
          shortName: '',
          wins: 0
        },
        message: null
      }
    },
    methods: {
      createTeam: function () {
        var _this = this
        fireTeam.createTeam(this.team).then(function (id) {
          _this.message = 'Created team with id: ' + id
        })
      }
    }
  }
</script>