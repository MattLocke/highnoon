<template lang="pug">
  .create-league
    .container(v-if="numLeagues < 8 || userData.isAdmin || userData.isPremier")
      h1 Create A New League
      section(v-show="!league.leagueType")
        .columns
          .column
            h2 Standard
            img.img(src="/images/league-standard.jpg" alt="standard league icon")
            p You and up to 9 other buddies can get together and draft teams to compete against one another!  Each week you'll be matched against a new opponent and best record at the end wins!
            .has-text-centered
              button.button.is-primary(@click="league.leagueType = 'standard'") Choose Standard
          .column
            h2 Unlimited
            img.img(src="/images/league-unlimited.jpg" alt="unlimited league icon")
            p Unlimited league sizes.  No roster restrictions.  Build your perfect team and see how well you score.  No head to head matchup, instead the points each week will be used for leaderboards.
            .has-text-centered
              button.button.is-primary(@click="league.leagueType = 'unlimited'") Choose Unlimited
              //- button.button.is-primary(disabled) Choose Unlimited
          .column
            h2 Pick 'em
            img.img(src="/images/league-pickem.jpg" alt="pickem league icon")
            p Each week choose which team will win each of the matchups.  This is more simple than we offered in Season 1 due to the overhead running full-fledged fantasy leagues brings to the table!
            .has-text-centered
              button.button.is-primary(@click="league.leagueType = 'pickem'") Choose Pick'Em
              //- button.button.is-primary(disabled) Choose Pick'Em
      section(v-show="league.leagueType")
        .columns
          .column
            h2 {{ league.leagueType }} League
          .column.is-narrow
            button.button.is-primary.is-small(@click="league.leagueType = ''") Change League Type
      section(v-if="league.leagueType")
        .columns
          .column.is-three-quarters-desktop
            b-field(label="League Name")
              b-input(placeholder="league name" v-model="league.leagueName")
          .column
            b-field(label="Password (optional)")
              b-input(placeholder="password" v-model="league.password")
      section(v-if="league.leagueType")
        button.button.is-primary(@click="createLeague" v-if="canCreateLeague") Create League
        button.button.is-primary(disabled v-else) Create League
    .box(v-else)
      .container
        section
          p I'm sorry, looks like you're all out of leagues!  Right now the only users with unlimited leagues
            a(href="https://www.patreon.com/highnoonpickem")  support me through patreon
            |  .  With leagues generating data, and data costing money, I tried to find a nice threshold where most users can be in several leagues, but I don't have to shutter the doors because I'm just bleeding to death.  So thank you to those who support me, and if you're having other issues, please hit me up or use the report issue button below.  Thank you!
</template>

<script>
import LeagueService from '@/services/league'

export default {
  name: 'CreateLeague',
  data () {
    return {
      league: {
        leagueName: null,
        leagueImageUrl: null,
        leagueType: null,
        password: null,
        passwordProtected: false,
        discord: null,
        instagram: null,
        reddit: null,
        twitter: null
      }
    }
  },
  computed: {
    numLeagues () {
      return 0
    },
    ownerId () {
      return this.$store.getters.getUserId
    },
    canCreateLeague () {
      return this.league.leagueName
    },
    userData () {
      return this.$store.getters.getUserData
    }
  },
  watch: {
    'league.password': {
      handler (val) {
        if (val.length > 0) this.league.passwordProtected = true
        else this.league.passwordProtected = false
      }
    }
  },
  methods: {
    createLeague () {
      let leagueData = {
        ...this.league,
        ownerId: this.ownerId
      }
      // no point in having useless nodes for an object
      if (leagueData.leagueType === 'standard') {
        leagueData = {
          requiredOffense: 2,
          requiredSupport: 2,
          requiredTank: 2,
          status: 'unDrafted',
          ...leagueData
        }
      }

      if (leagueData.leagueType === 'standard') {
        leagueData.message = `![Discord Admins](https://firebasestorage.googleapis.com/v0/b/overwatch-pickem.appspot.com/o/images%2Fnews%2Fhn_defhead_standraft2.png?alt=media&token=5ab433e3-ac25-4037-93ed-ea5a23b7d28a)
        [View full Standard Draft requirements and guidelines.](https://highnoon.gg/#/article/Na1lrkeu2s2Pwi8wbQrp)`
      }

      if (leagueData.leagueType === 'unlimited') {
        leagueData.message = `![Discord Admins](https://firebasestorage.googleapis.com/v0/b/overwatch-pickem.appspot.com/o/images%2Fnews%2Fhn_defhead_unldraft.png?alt=media&token=854eab8b-86b4-4691-9220-782c7e979d2f)
        [View full Unlimited Draft requirements and guidelines.](https://highnoon.gg/#/article/DUtOLV2iYsTplEgvH3fv)`
      }

      if (leagueData.leagueType === 'pickem') {
        leagueData.message = `![Discord Admins](https://firebasestorage.googleapis.com/v0/b/overwatch-pickem.appspot.com/o/images%2Fnews%2Fhn_defhead_pickem.png?alt=media&token=dbab607a-c3f7-400d-93f0-2638878e91e2)
        [View full Pick 'Em requirements and guidelines.](https://highnoon.gg/#/article/Jx3Z8ZbpWlAon6zx9Osd)`
      }

      this.$store.dispatch('setLoading', true)
      LeagueService.createLeague(this.userData, leagueData)
        .then((leagueId) => {
          this.$store.dispatch('setLoading', false)
          const upperType = this.capFirst(leagueData.leagueType)
          if (leagueId) this.$router.push({ path: `/League${upperType}/${leagueId}` })
        })
        .catch(() => {
          this.$store.dispatch('setLoading', false)
          // some kind of error message here as well.
        })
    },
    capFirst (string) {
      return `${string.charAt(0).toUpperCase()}${string.slice(1)}`
    }
  }
}
</script>

<style lang="scss">
.create-league {
  p {
    margin-bottom: 1rem;
  }
  .is-max-height {
    height: 100%;
  }
  .micro {
    font-size: .6rem;
    display: block;
  }
}
</style>
