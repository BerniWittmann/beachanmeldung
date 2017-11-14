import tournamentTransformer from './../../transformers/tournament';
import store from './../../store';
import Vue from 'vue';

// When the request succeeds
const success = (tournaments) => {
  tournaments = tournamentTransformer.fetchCollection(tournaments);

  store.dispatch('tournament/store', tournaments);
};

// When the request fails
const failed = () => {
  Vue.$notify.error({
    title: Vue.i18n.t('tournament.notifications.get.failed.title'),
    message: Vue.i18n.t('tournament.notifications.get.failed.message'),
  });
};

export default () =>
  Vue.$http.get('/tournaments/')
    .then((response) => {
      success(response.data);
    }).catch((error) => {
      failed(error);
    });
