import listPlayerTransformer from './../../transformers/listplayer';
import store from './../../store';
import Vue from 'vue';

// When the request succeeds
const success = (players) => {
  players = listPlayerTransformer.fetchCollection(players);

  store.dispatch('player/store', players);
};

// When the request fails
const failed = (error) => {
  if ([403, 401].includes(error.response.status)) {
    Vue.router.replace({
      name: 'home.index',
    });
    return Vue.$notify.error({
      title: Vue.i18n.t('player.notifications.get.forbidden.title'),
      message: Vue.i18n.t('player.notifications.get.forbidden.message'),
    });
  }
  return Vue.$notify.error({
    title: Vue.i18n.t('player.notifications.get.failed.title'),
    message: Vue.i18n.t('player.notifications.get.failed.message'),
  });
};

export default () =>
  Vue.$http.get('/players/')
    .then((response) => {
      success(response.data);
    }).catch((error) => {
      failed(error);
    });
