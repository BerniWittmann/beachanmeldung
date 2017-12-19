/* ============
 * Mutations for the player module
 * ============
 *
 * The mutations that are available on the
 * player module.
 */

import { STORE } from './mutation-types';

export default {
  [STORE](state, players) {
    state.players = players || [];
  },
};
