import teamTransformer from './../../transformers/team';
import store from './../../store';
import Vue from 'vue';

// When the request succeeds
const success = (team) => {
  team = teamTransformer.fetch(team);

  store.dispatch('team/addSingle', team);
  return Promise.resolve(team);
};

// When the request fails
const failed = (error) => {
  if (error && error.response && error.response.data && error.response.data.key && error.response.data.key[0] === 'name_already_taken') {
    Vue.$notify.error({
      title: Vue.i18n.t('team.notifications.post.name_already_taken.title'),
      message: Vue.i18n.t('team.notifications.post.name_already_taken.message'),
    });
  } else {
    Vue.$notify.error({
      title: Vue.i18n.t('team.notifications.post.failed.title'),
      message: Vue.i18n.t('team.notifications.post.failed.message'),
    });
  }
  return Promise.reject();
};

export default team =>
  Vue.$http.post('/teams/', teamTransformer.send(team))
    .then(response => success(response.data))
    .catch(error => failed(error));
