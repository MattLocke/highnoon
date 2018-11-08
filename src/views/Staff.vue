<template lang="pug">
  .staff
    .columns
      left-bar
        h1 Staff
        button.button.is-primary(v-if="isAdmin" @click="addMemberMode = true") Add Staff Member
        staff-listing(v-for="staffListing in staff" :key="article.id" :staff="staffListing" @set-staff="setStaff")
      .column
        .container
          add-staff-member(v-if="addMemberMode" @cancel="addMemberMode = false")
          section.section(v-else)
            h1 Staff Listing
</template>

<script>
import addStaffMember from '@/views/staff/AddStaffMember'
import staffListing from '@/views/staff/StaffListing'

export default {
  name: 'Staff',
  components: {
    addStaffMember,
    staffListing
  },
  data () {
    return {
      activeStaffMember: {},
      staff: [],
      addMemberMode: false
    }
  },
  computed: {
    user () {
      return this.$store.getters.getUserData
    },
    isAdmin () {
      return this.user.isAdmin || false
    }
  },
  methods: {
    setStaff (staffMember) {
      this.activeStaffMember = staffMember
    }
  }
}
</script>
