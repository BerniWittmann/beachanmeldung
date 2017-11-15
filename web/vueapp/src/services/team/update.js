import teamTransformer from './../../transformers/team';
import store from './../../store';
import Vue from 'vue';

// When the request succeeds
const success = (team) => {
  team = teamTransformer.fetch(team);

  store.dispatch('team/updateSingle', team);
};

// When the request fails
const failed = () => {
  Vue.$notify.error({
    title: Vue.i18n.t('team.notifications.put.failed.title'),
    message: Vue.i18n.t('team.notifications.put.failed.message'),
  });
};

export default (team) => {
  const teamID = team.id;
  return Vue.$http.put(`/teams/${teamID}/`, teamTransformer.send(team))
    .then((response) => {
      success(response.data);
    }).catch((error) => {
      failed(error);
    });
};
