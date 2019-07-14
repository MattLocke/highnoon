<template lang="pug">
  .match-listing(v-if="pickStats && match.awayId")
    .columns.is-gapless.is-mobile
      .column.is-narrow.has-text-centered(v-if="match.winner")
        span.is-size-5.ow-font {{ match.winner == match.awayId ? 'WON' : 'LOSS' }}
      .column.is-narrow.has-text-centered
        img(:src="`images/teams/${match.awayShortName}.svg`" width="28" height="28")
      .column.is-narrow.has-text-centered
        .ow-font.team-name.is-size-5(v-tooltip="`${leftPercent}% choose ${match.awayShortName}`") {{ match.awayShortName }}
      .column.is-narrow.has-text-centered.select-column-left(v-if="!isDisabled")
        b-radio.is-pulled-right.winner-radio(v-model="matchWinner" size="is-medium" :native-value="match.awayId")
      .column.is-narrow.has-text-centered.select-column-left(v-else)
        b-radio.is-pulled-right.winner-radio.correct-radio(selected size="is-medium" v-if="matchWinner === match.winner && matchWinner == match.awayId")
        b-radio.is-pulled-right.winner-radio.incorrect-radio(selected size="is-medium" v-else-if="matchWinner == match.awayId")
        b-radio.is-pulled-right.winner-radio.neutral-radio(selected size="is-medium" v-else)
      .column.is-narrow.has-text-centered(v-if="showPickRates")
        span.ow-font.is-size-5 {{ leftPercent }}%
      .column.has-text-centered
        .match-date {{ match.startDateTS | formatJSDate }}
        .match-time {{ match.startDateTS | formatJSTime }}
      .column.is-narrow.has-text-centered(v-if="showPickRates")
        span.ow-font.is-size-5 {{ rightPercent }}%
      .column.is-narrow.has-text-centered.select-column-right(v-if="!isDisabled")
        b-radio.winner-radio(v-model="matchWinner" size="is-medium" :native-value="match.homeId")
      .column.is-narrow.has-text-centered.select-column-right(v-else)
        b-radio.winner-radio.correct-radio(selected size="is-medium" v-if="matchWinner === match.winner && matchWinner == match.homeId")
        b-radio.winner-radio.incorrect-radio(selected size="is-medium" v-else-if="matchWinner == match.homeId")
        b-radio.winner-radio.neutral-radio(selected size="is-medium" v-else)
      .column.is-narrow.has-text-centered
        .ow-font.team-name.is-size-5(v-tooltip="`${rightPercent}% choose ${match.homeShortName}`") {{ match.homeShortName }}
      .column.is-narrow.has-text-centered
        img(:src="`images/teams/${match.homeShortName}.svg`" width="28" height="28")
      .column.is-narrow.has-text-centered(v-if="match.winner")
        span.is-size-5.ow-font {{ match.winner == match.homeId ? 'WON' : 'LOSS' }}
    .pick-rates(:style="{'background-color': `#${match.homePrimaryColor == '000000' ? match.homeSecondaryColor : match.homePrimaryColor}`}" v-if="showPickRates")
      .pick-percentage-bar(:style="pickStyles")
</template>

<script>
import { get } from 'lodash'
import PicksService from '@/services/picks'

export default {
  name: 'MatchListing',
  props: {
    leagueId: {
      type: [String, Number],
      required: true
    },
    match: {
      type: Object,
      required: true
    },
    pickStats: {
      type: Object,
      required: true
    },
    showPickRates: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      matchWinner: ''
    }
  },
  computed: {
    config () {
      return this.$store.getters.getConfig
    },
    isDisabled () {
      const now = Date.now()
      return (this.match.startDateTS < (now - 600000))
    },
    leftPercent () {
      const leftTotal = get(this.pickStats, `${this.match.id}.${this.match.awayId}`, 0)
      return leftTotal ? Math.round(leftTotal / this.totalPicks * 100) : 0
    },
    rightPercent () {
      const rightTotal = get(this.pickStats, `${this.match.id}.${this.match.homeId}`)
      return rightTotal ? Math.round(rightTotal / this.totalPicks * 100) : 0
    },
    pickStyles () {
      return { 'width': `${this.leftPercent}%`, 'background-color': `#${this.match.awayPrimaryColor === '000000' ? this.match.awaySecondaryColor : this.match.awayPrimaryColor}` }
    },
    totalPicks () {
      const left = get(this.pickStats, `${this.match.id}.${this.match.awayId}`, 0)
      const right = get(this.pickStats, `${this.match.id}.${this.match.homeId}`, 0)
      const totalPicks = (left + right)
      return totalPicks
    },
    userId () {
      return this.$store.getters.getUserId
    },
    userPicks () {
      return this.$store.getters.getUserPicks
    },
    finishedMatchWinner () {
      if (this.userPicks[this.match.id] && this.userPicks[this.match.id].points > 0) return true
      return false
    }
  },
  watch: {
    matchWinner (val) {
      if (val && (this.match && !this.match.winner)) this.savePick()
    },
    userPicks: {
      immediate: true,
      handler (val) {
        if (val) {
          if (val[this.match.id]) this.matchWinner = val[this.match.id].winner
        }
      }
    }
  },
  methods: {
    savePick () {
      console.log('Saving Picks...')
      // make sure we don't fire a save for something that already exists
      if (!this.userPicks[this.match.id] || this.userPicks[this.match.id].winner !== this.matchWinner) {
        this.$store.dispatch('setLoading', true)
        const pick = {
          matchId: this.match.id,
          stage: this.config.currentStage,
          userId: this.userId,
          week: this.config.currentWeek,
          winner: this.matchWinner
        }
        PicksService.canSave(pick)
          .then((theyCan) => {
            if (theyCan) {
              PicksService.savePick(pick)
                .then(() => {
                  this.$store.dispatch('fetchPicks')
                  this.$toast.open({
                    message: 'Successfully saved pick!',
                    type: 'is-success',
                    position: 'is-bottom'
                  })
                })
                .catch((e) => {
                  this.$toast.open({
                    message: 'Pick can not be saved!',
                    type: 'is-danger',
                    position: 'is-bottom'
                  })
                })
            } else {
              this.$toast.open({
                message: 'Match is locked, so this pick will not be saved!',
                type: 'is-danger',
                position: 'is-bottom'
              })
            }
          })
          .finally(() => {
            this.$store.dispatch('setLoading', false)
          })
      }
    }
  }
}
</script>

<style lang="scss">
.match-listing {
  background-color: rgba(255,255,255,0.1);
  margin-bottom: .25rem;
  padding: .25rem;
  .pick-rates {
    height: 8px;
    margin-top: -1rem;
  }
  .pick-percentage-bar {
    height: 8px;
  }

  .select-column-left .check {
    margin-left: 2px;
  }

  .select-column-right .check {
    margin-left: 8px!important;
    margin-right: -8px;
  }

  .team-name {
    width: 32px;
  }
  .b-checkbox.checkbox {
    margin-top: .35rem;
  }
  .match-date {
    font-size: .75rem;
    display: block;
  }
  .match-time {
    display: block;
    font-size: .6rem;
  }
  img {
    margin: 0 .5rem -.75rem .5rem;
  }
  .winner-radio {
    .check {
      margin-bottom: -1.8rem;
    }
  }
  .b-radio.radio.incorrect-radio input[type=radio]:checked + .check {
    border-color: #a42621;
  }
  .b-radio.radio.incorrect-radio input[type=radio] + .check:before {
    background-color: #a42621;
  }
  .b-radio.radio.correct-radio input[type=radio]:checked + .check {
    border-color: #21a431;
  }
  .b-radio.radio.correct-radio input[type=radio] + .check:before {
    background-color: #21a431;
  }
  .b-radio.radio.neutral-radio input[type=radio]:checked + .check {
    border-color: rgba(0,0,0,0.1);
  }
  .b-radio.radio.neutral-radio input[type=radio] + .check:before {
    background-color: #222;
  }
}
</style>
