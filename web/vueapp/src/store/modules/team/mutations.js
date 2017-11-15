/* ============
 * Mutations for the team module
 * ============
 *
 * The mutations that are available on the
 * team module.
 */

import { STORE, SET_ACTIVE, UPDATE, ADD } from './mutation-types';

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
    teams.forEach((team) => {
      /* eslint-disable arrow-body-style */
      state.teams = state.teams.map((single) => {
        return team.id === single.id ? team : single;
      });
      /* eslint-enable arrow-body-style */
    });
  },
};
