import firebase from 'firebase/app'
import 'firebase/firestore'
import { fireInit } from '@/fireLogin'

fireInit()

var db = firebase.database()

export default {
  state: {
    draft: {},
    draftPicks: [],
    draftOrder: []
  },
  mutations: {
    SET_DRAFT: (state, payload) => {
      state.draft = payload
    },
    SET_DRAFT_ORDER: (state, payload) => {
      if (payload) state.draftOrder = payload
    },
    SET_DRAFT_PICKS: (state, payload) => {
      state.draftPicks = payload
    }
  },
  actions: {
    fetchDraft: (context, leagueId) => {
      if (leagueId) {
        db.ref(`/draft/${leagueId}`).on('value', (snapshot) => {
          if (snapshot.exists) context.commit('SET_DRAFT', snapshot.val())
        })
      } else {
        context.commit('SET_DRAFT', {})
      }
    },
    fetchDraftOrder: ({ commit }, leagueId) => {
      if (leagueId) {
        db.ref(`/draftOrder/${leagueId}`).on('value', (snapshot) => {
          if (snapshot.exists) commit('SET_DRAFT_ORDER', snapshot.val())
        })
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
    getDraftOrder: state => state.draftOrder,
    getDraftPicks: state => state.draftPicks
  }
}
