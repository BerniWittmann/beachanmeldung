/* ============
 * Getters for the team module
 * ============
 *
 * The getters that are available on the
 * team module.
 */

export default {
  teamsByTournament(state) {
    /* eslint-disable arrow-body-style */
    return (tournamentID) => {
      return state.teams.filter((single) => {
        return single.tournament.id === tournamentID;
      });
    };
    /* eslint-enable arrow-body-style */
  },

  teamsByUser(state, getters, rootState) {
    if (!rootState.account.email) return [];
    return state.teams.filter(single => single.trainer
      && single.trainer.email
      && rootState.account.email === single.trainer.email);
  },
};
