<template lang="pug">
  .league-pickem
    h1 League View for Pick'em
    delete-league
    invite-link
    league-image
    ledger
    lock-league
    password-protect
    remove-user
</template>

<script>
import DeleteLeague from '@/views/pickem/DeleteLeague'
import InviteLink from '@/views/pickem/InviteLink'
import LeagueImage from '@/views/pickem/LeagueImage'
import Ledger from '@/views/pickem/Ledger'
import LockLeague from '@/views/pickem/LockLeague'
import PasswordProtect from '@/views/pickem/PasswordProtect'
import RemoveUser from '@/views/pickem/RemoveUser'

export default {
  components: {
    DeleteLeague,
    InviteLink,
    LeagueImage,
    Ledger,
    LockLeague,
    PasswordProtect,
    RemoveUser
  }
}
</script>

