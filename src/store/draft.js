import firebase from 'firebase/app'
import 'firebase/firestore'
import { fireInit } from '@/fireLogin'

fireInit()

var db = firebase.database()

export default {
  state: {
    draft: {},
    draftPicks: []
  },
  mutations: {
    SET_DRAFT: (state, payload) => {
      state.draft = payload
    },
    SET_DRAFT_PICKS: (state, payload) => {
      state.draftPicks = payload
    }
  },
  actions: {
    fetchDraft: (context, leagueId) => {
      if (leagueId) {
        db.ref(`/draft/${leagueId}`).on('value', (snapshot) => {
          context.commit('SET_DRAFT', snapshot.val())
        })
      } else {
        context.commit('SET_DRAFT', {})
      }
    },
    fetchDraftPicks: (context, leagueId) => {
      if (leagueId) {
        db.ref(`/draftPicks/${leagueId}`).on('value', (snapshot) => {
          context.commit('SET_DRAFT_PICKS', snapshot.val())
        })
      } else {
        context.commit('SET_DRAFT_PICKS', [])
      }
    }
  },
  getters: {
    getDraft: state => state.draft,
    getDraftPicks: state => state.draftPicks
  }
}
