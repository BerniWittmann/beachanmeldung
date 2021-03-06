import teamTransformer from './../../transformers/team';
import store from './../../store';
import Vue from 'vue';

// When the request succeeds
const success = (team) => {
  team = teamTransformer.fetch(team);

  store.dispatch('team/updateSingle', team);
};

// When the request fails
const failed = (error) => {
  if (error && error.response && error.response.data && error.response.data.key && error.response.data.key[0] === 'name_already_taken') {
    Vue.$notify.error({
      title: Vue.i18n.t('team.notifications.put.name_already_taken.title'),
      message: Vue.i18n.t('team.notifications.put.name_already_taken.message'),
    });
  } else if (error && error.response && error.response.data && error.response.data.key && error.response.data.key[0] === 'duplicate_player_number') {
    Vue.$notify.error({
      title: Vue.i18n.t('team.notifications.put.duplicate_player_number.title'),
      message: Vue.i18n.t('team.notifications.put.duplicate_player_number.message'),
    });
  } else if (error && error.response && error.response.data && error.response.data.key && error.response.data.key[0] === 'duplicate_player_name') {
    Vue.$notify.error({
      title: Vue.i18n.t('team.notifications.put.duplicate_player_name.title'),
      message: Vue.i18n.t('team.notifications.put.duplicate_player_name.message'),
    });
  } else if (error && error.response && error.response.data && error.response.data.key && error.response.data.key === 'after_deadline_edit') {
    Vue.$notify.error({
      title: Vue.i18n.t('team.notifications.put.after_deadline_edit.title'),
      message: Vue.i18n.t('team.notifications.put.after_deadline_edit.message'),
    });
  } else {
    Vue.$notify.error({
      title: Vue.i18n.t('team.notifications.put.failed.title'),
      message: Vue.i18n.t('team.notifications.put.failed.message'),
    });
  }
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
