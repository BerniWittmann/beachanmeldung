import teamTransformer from './../../transformers/team';
import store from './../../store';
import Vue from 'vue';
import tournamentService from '@/services/tournament';

// When the request succeeds
const success = (team) => {
  team = teamTransformer.fetch(team);

  store.dispatch('team/updateSingle', team);
  tournamentService.getByID(team.tournament.id);
};

// When the request fails
const failed = () => {
  Vue.$notify.error({
    title: Vue.i18n.t('team.notifications.state_change.failed.title'),
    message: Vue.i18n.t('team.notifications.state_change.failed.message'),
  });
};

export default (teamID, state) =>
  Vue.$http.put(`/teams/${teamID}/update_state/`, { state })
    .then((response) => {
      success(response.data);
    }).catch((error) => {
      failed(error);
    });
