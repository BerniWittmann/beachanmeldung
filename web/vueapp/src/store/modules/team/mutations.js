/* ============
 * Mutations for the team module
 * ============
 *
 * The mutations that are available on the
 * team module.
 */

import { STORE } from './mutation-types';

export default {
  [STORE](state, members) {
    state.members = members || [];
  },
};
