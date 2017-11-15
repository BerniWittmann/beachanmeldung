import teamTransformer from './../../transformers/team';
import store from './../../store';
import Vue from 'vue';

// When the request succeeds
const success = (team) => {
  team = teamTransformer.fetchCollection(team);

  store.dispatch('team/addSingle', team);
};

// When the request fails
const failed = () => {
  Vue.$notify.error({
    title: Vue.i18n.t('team.notifications.post.failed.title'),
    message: Vue.i18n.t('team.notifications.post.failed.message'),
  });
};

export default team =>
  Vue.$http.post('/teams/', teamTransformer.send(team))
    .then((response) => {
      success(response.data);
    }).catch((error) => {
      failed(error);
    });
