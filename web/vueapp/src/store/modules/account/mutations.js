/* ============
 * Mutations for the account module
 * ============
 *
 * The mutations that are available on the
 * account module.
 */

import { STORE } from './mutation-types';

export default {
  [STORE](state, account) {
    state.email = account.email;
    state.firstName = account.firstName;
    state.lastName = account.lastName;
    state.isVerified = account.isVerified;
    state.dateJoined = account.dateJoined;
    state.isStaff = account.isStaff;
    state.phone = account.phone;
  },
};
