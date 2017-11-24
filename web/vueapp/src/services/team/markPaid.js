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
    title: Vue.i18n.t('team.notifications.paid_change.failed.title'),
    message: Vue.i18n.t('team.notifications.paid_change.failed.message'),
  });
};

export default teamID =>
  Vue.$http.post(`/teams/${teamID}/mark_paid/`)
    .then((response) => {
      success(response.data);
    }).catch((error) => {
      failed(error);
    });
