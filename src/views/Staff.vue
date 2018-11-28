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
            p I'm thinking here I'll just pull from the DB, and mark all staff with a bool.
          section
            .staff-detail
              .columns
                .column.is-narrow
                  img.img(:src="user.profileImageUrl")
                .column
                  h2 {{ user.displayName }}
                  span.staff-title Site Owner
                  hr
                  p Here is a summary we'll have to have all of the staff fill out so we have it when rendering this part of the object.
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

<style lang="scss">
.staff-title {
  font-size: .8rem;
  margin-top: -.6rem;
  display: block;
}
</style>
