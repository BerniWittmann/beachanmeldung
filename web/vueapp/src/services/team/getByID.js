import teamTransformer from './../../transformers/team';
import store from './../../store';
import Vue from 'vue';

// When the request succeeds
const success = (team) => {
  team = teamTransformer.fetch(team);

  store.dispatch('team/updateSingle', team);
  store.dispatch('team/setActive', team);
};

// When the request fails
const failed = () => {
  Vue.router.replace({
    name: 'home.index',
  });
  Vue.$notify.error({
    title: Vue.i18n.t('team.notifications.get.failed.title'),
    message: Vue.i18n.t('team.notifications.get.failed.message'),
  });
};

export default teamID =>
  Vue.$http.get(`/teams/${teamID}/`)
    .then((response) => {
      success(response.data);
    }).catch((error) => {
      failed(error);
    });
