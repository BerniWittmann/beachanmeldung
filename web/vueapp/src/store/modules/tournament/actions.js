/* ============
 * Actions for the tournament module
 * ============
 *
 * The actions that are available on the
 * tournament module.
 */

import * as types from './mutation-types';

export const store = ({ commit }, payload) => {
  commit(types.STORE, payload);
};

export const setActive = ({ commit }, payload) => {
  commit(types.SET_ACTIVE, payload);
};

export default {
  store,
  setActive,
};
