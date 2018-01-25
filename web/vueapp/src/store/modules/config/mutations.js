/* ============
 * Mutations for the config module
 * ============
 *
 * The mutations that are available on the
 * config module.
 */

import {
  STORE,
} from './mutation-types';

export default {
  [STORE](state, data) {
    state.year = data.year || state.year;
    state.welcomeText = data.welcomeText || state.welcomeText;
    state.termsOfParticipation = data.termsOfParticipation || state.termsOfParticipation;
  },
};
