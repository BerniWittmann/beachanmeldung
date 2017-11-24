import store from './../../store';

export default (teamID) => {
  if (!teamID || teamID <= 0) return false;
  const account = store.state.account;
  if (account.isStaff) return true;
  if (!account.email) return false;

  const currentTeam = store.state.team.teams.find(team => team.id === teamID);

  if (!currentTeam || !currentTeam.trainer || !currentTeam.trainer.email) return false;
  return currentTeam.trainer.email === account.email;
};
