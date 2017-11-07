/* ============
 * Mutations for the tournament module
 * ============
 *
 * The mutations that are available on the
 * tournament module.
 */

import { STORE, SET_ACTIVE } from './mutation-types';

export default {
  [STORE](state, tournaments) {
    state.tournaments = tournaments || [];
  },
  [SET_ACTIVE](state, tournament) {
    state.activeTournament = tournament;
  },
};
