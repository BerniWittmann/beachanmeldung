/* ============
 * Actions for the player module
 * ============
 *
 * The actions that are available on the
 * player module.
 */

import * as types from './mutation-types';

export const store = ({ commit }, payload) => {
  commit(types.STORE, payload);
};

export default {
  store,
};
