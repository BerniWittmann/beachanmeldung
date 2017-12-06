import Vue from 'vue';
import accountService from './../account';
import store from './../../store';

// When the request succeeds
const success = (token, params) => {
  store.dispatch('auth/login', token);
  accountService.find();
  if (params && params.noredirect) return Promise.resolve();
  Vue.router.push({
    name: 'home.index',
  });
  return Promise.resolve();
};

// When the request fails
const failed = (error) => {
  if (error && error.response && error.response.data && error.response.data.key === 'account_not_active') {
    Vue.$notify.error({
      title: Vue.i18n.t('auth.notifications.login.inactive.title'),
      message: Vue.i18n.t('auth.notifications.login.inactive.message'),
    });
  } else if (error && error.response && error.response.data && error.response.data.key === 'account_not_verified') {
    Vue.$notify.error({
      title: Vue.i18n.t('auth.notifications.login.not_verified.title'),
      message: Vue.i18n.t('auth.notifications.login.not_verified.message'),
    });
  } else {
    Vue.$notify.error({
      title: Vue.i18n.t('auth.notifications.login.failed.title'),
      message: Vue.i18n.t('auth.notifications.login.failed.message'),
    });
  }
  return Promise.reject();
};

export default (user, params) =>
  /*
   * Normally you would perform an AJAX-request.
   * But to get the example working, the data is hardcoded.
   *
   * With the include REST-client Axios, you can do something like this:
   * Vue.$http.post('/auth/login', user)
   *   .then((response) => {
   *     success(response);
   *   })
   *   .catch((error) => {
   *     failed(error);
   *   });
   */
  Vue.$http.post('/account/login/', user)
    .then(response => success(response.data.token, params))
      .catch(error => failed(error));
