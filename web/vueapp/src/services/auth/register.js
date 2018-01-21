import Vue from 'vue';
import UserTransformer from './../../transformers/user';

// When the request succeeds
const success = (params) => {
  Vue.$notify.success({
    title: Vue.i18n.t('auth.notifications.register.success.title'),
    message: Vue.i18n.t('auth.notifications.register.success.message'),
  });
  if (params && params.noredirect) return Promise.resolve();
  Vue.router.push({
    name: 'auth.login',
  });
  return Promise.resolve();
};

// When the request fails
const failed = (error) => {
  if (error && error.response && error.response.data && error.response.data.key === 'user_already_exists') {
    Vue.$notify.error({
      title: Vue.i18n.t('auth.notifications.register.user_already_exists.title'),
      message: Vue.i18n.t('auth.notifications.register.user_already_exists.message'),
    });
  } else {
    Vue.$notify.error({
      title: Vue.i18n.t('auth.notifications.register.error.title'),
      message: Vue.i18n.t('auth.notifications.register.error.message'),
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
   * Vue.$http.post('/register', user)
   *   .then((response) => {
   *     success(response);
   *   })
   *   .catch((error) => {
   *     failed(error);
   *   });
   */
  Vue.$http.post('/account/signup/', UserTransformer.send(user))
    .then(() => success(params))
    .catch(error => failed(error));
