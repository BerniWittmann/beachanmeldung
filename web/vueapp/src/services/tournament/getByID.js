import tournamentTransformer from './../../transformers/tournament';
import store from './../../store';
import Vue from 'vue';

// When the request succeeds
const success = (tournament) => {
  tournament = tournamentTransformer.fetch(tournament);

  store.dispatch('tournament/setActive', tournament);
};

// When the request fails
const failed = () => {
  Vue.router.replace({
    name: 'home.index',
  });
  Vue.$notify.error({
    title: Vue.i18n.t('tournament.notifications.get.failed.title'),
    message: Vue.i18n.t('tournament.notifications.get.failed.message'),
  });
};

export default tournamentID =>
  Vue.$http.get(`/tournaments/${tournamentID}/`)
    .then((response) => {
      success(response.data);
    }).catch((error) => {
      failed(error);
    });
