import teamTransformer from './../../transformers/team';
import store from './../../store';
import Vue from 'vue';

// When the request succeeds
const success = (teams) => {
  teams = teamTransformer.fetchCollection(teams);

  store.dispatch('team/update', teams);
};

// When the request fails
const failed = () => {
  Vue.$notify.error({
    title: Vue.i18n.t('team.notifications.get.failed.title'),
    message: Vue.i18n.t('team.notifications.get.failed.message'),
  });
};

export default () =>
  Vue.$http.get('/teams/mine/')
    .then((response) => {
      success(response.data);
    }).catch((error) => {
      failed(error);
    });
