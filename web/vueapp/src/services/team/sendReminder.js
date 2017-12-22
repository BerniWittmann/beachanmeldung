import Vue from 'vue';

import { reminderTypes } from '@/utils/constants';

// When the request succeeds
const success = (data) => {
  if (data && Object.keys(data).length > 0) {
    Vue.$notify.warning({
      title: Vue.i18n.t('team.notifications.send_reminder.success_partial.title'),
      message: Vue.i18n.t('team.notifications.send_reminder.success_partial.message'),
    });
  } else {
    Vue.$notify.success({
      title: Vue.i18n.t('team.notifications.send_reminder.success.title'),
      message: Vue.i18n.t('team.notifications.send_reminder.success.message'),
    });
  }
};

// When the request fails
const failed = () => {
  Vue.$notify.error({
    title: Vue.i18n.t('team.notifications.send_reminder.error.title'),
    message: Vue.i18n.t('team.notifications.send_reminder.error.message'),
  });
};

export default (teamIDs, type) => {
  if (!Object.values(reminderTypes).includes(type)) return new Promise().reject();

  return Vue.$http.post(`/teams/send_${type}_reminder/`, {
    teams: teamIDs,
  }).then((response) => {
    success(response.data);
  }).catch((error) => {
    failed(error);
  });
};
