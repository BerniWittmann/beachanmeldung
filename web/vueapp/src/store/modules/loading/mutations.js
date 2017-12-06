/* ============
 * Mutations for the loading module
 * ============
 *
 * The mutations that are available on the
 * loading module.
 */

import {
  SET,
  UNSET,
  SET_NAVIGATION,
  UNSET_NAVIGATION,
} from './mutation-types';

export default {
  [SET](state) {
    state.loading = true;
  },

  [UNSET](state) {
    state.loading = false;
  },
  [SET_NAVIGATION](state) {
    state.loadingNavigation = true;
  },

  [UNSET_NAVIGATION](state) {
    state.loadingNavigation = false;
  },
};
