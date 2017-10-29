/* ============
 * Actions for the loading module
 * ============
 *
 * The actions that are available on the
 * loading module.
 */

import * as types from './mutation-types';

export const set = ({ commit }) => {
  commit(types.SET);
};

export const unset = ({ commit }) => {
  commit(types.UNSET);
};

export default {
  set,
  unset,
};
