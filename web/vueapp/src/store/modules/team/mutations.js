/* ============
 * Mutations for the team module
 * ============
 *
 * The mutations that are available on the
 * team module.
 */

import { STORE, SET_ACTIVE, UPDATE, ADD } from './mutation-types';
import { arrayUnion } from '@/utils/helpers';

export default {
  [STORE](state, teams) {
    state.teams = teams || [];
  },
  [SET_ACTIVE](state, team) {
    state.activeTeam = team;
  },
  [ADD](state, teams) {
    state.teams = state.teams.concat(teams);
  },
  [UPDATE](state, teams) {
    state.teams = arrayUnion(state.teams, teams, (a, b) => a.id === b.id);
  },
};
