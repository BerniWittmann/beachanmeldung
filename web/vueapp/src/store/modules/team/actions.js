/* ============
 * Actions for the team module
 * ============
 *
 * The actions that are available on the
 * team module.
 */

import * as types from './mutation-types';

export const store = ({ commit }, payload) => {
  commit(types.STORE, payload);
};

export const setActive = ({ commit }, payload) => {
  commit(types.SET_ACTIVE, payload);
};

export const add = ({ commit }, payload) => {
  if (payload) {
    commit(types.ADD, payload);
  }
};

export const addSingle = ({ commit }, payload) => {
  if (payload) {
    commit(types.ADD, [payload]);
  }
};

export const update = ({ commit, state }, payload) => {
  commit(types.UPDATE, payload);
  if (state.activeTeam) {
    payload.forEach((team) => {
      if (state.activeTeam.id === team.id) {
        commit(types.SET_ACTIVE, team);
      }
    });
  }
};

export const updateSingle = ({ commit, state }, payload) => {
  commit(types.UPDATE, [payload]);
  if (state.activeTeam && state.activeTeam.id === payload.id) {
    commit(types.SET_ACTIVE, payload);
  }
};

export default {
  store,
  setActive,
  add,
  addSingle,
  update,
  updateSingle,
};
