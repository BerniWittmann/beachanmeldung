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
} from './mutation-types';

export default {
  [SET](state) {
    state.loading = true;
  },

  [UNSET](state) {
    state.loading = false;
  },
};
