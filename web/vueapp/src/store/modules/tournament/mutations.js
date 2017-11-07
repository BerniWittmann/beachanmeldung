/* ============
 * Mutations for the tournament module
 * ============
 *
 * The mutations that are available on the
 * tournament module.
 */

import { STORE } from './mutation-types';

export default {
  [STORE](state, tournaments) {
    state.tournaments = tournaments || [];
  },
};
