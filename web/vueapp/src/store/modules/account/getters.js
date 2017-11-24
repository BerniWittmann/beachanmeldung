/* ============
 * Getters for the account module
 * ============
 *
 * The getters that are available on the
 * account module.
 */

export default {
  isTrainerOfTeam(state, getters, rootState) {
    /* eslint-disable arrow-body-style */
    return (team) => {
      if (!team || !team.trainer || !team.trainer.email) return false;
      const currentUserID = rootState.account.email;
      if (!currentUserID) return false;
      return currentUserID === team.trainer.email;
    };
    /* eslint-enable arrow-body-style */
  },
};
