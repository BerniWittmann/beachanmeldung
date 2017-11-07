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

export default {
  store,
};
