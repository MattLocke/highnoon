<template lang="pug">
  .league-pickem
    .columns
      left-bar
        h1 League View for Pick'em
        delete-league
        invite-link
        league-image
        ledger
        lock-league
        password-protect
        remove-user
      .column
        .box
          h1 League overview for Pick'em - Yep.
</template>

<script>
import DeleteLeague from '@/views/pickem/DeleteLeague'
import InviteLink from '@/views/pickem/InviteLink'
import LeagueImage from '@/views/pickem/LeagueImage'
import Ledger from '@/views/pickem/Ledger'
import LeftBar from '@/components/LeftBar'
import LockLeague from '@/views/pickem/LockLeague'
import PasswordProtect from '@/views/pickem/PasswordProtect'
import RemoveUser from '@/views/pickem/RemoveUser'

export default {
  components: {
    DeleteLeague,
    InviteLink,
    LeagueImage,
    Ledger,
    LeftBar,
    LockLeague,
    PasswordProtect,
    RemoveUser
  },
  data () {
    return {
      league: {
        name: 'SouldrinK\'s League',
        isLocked: false,
        id: 'LKSJGSWDH8787SDLKFJS',
        creatorId: 'LJSGHSHDFHSK879SDKD',
        managers: [],
        maxUsers: 0,
        message: '',
        leagueImage: '',
        competitionId: 'GGFFSJDKJSLJ8907SKJ'
      },
      leagueUsers: [],
      ledger: []
    }
  }
}
</script>
