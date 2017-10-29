import Vue from 'vue';
import UserTransformer from './../../transformers/user';

// When the request succeeds
const success = () => {
  Vue.router.push({
    name: 'auth.login',
  });
  Vue.$notify.success({
    title: Vue.i18n.t('auth.notifications.register.success.title'),
    message: Vue.i18n.t('auth.notifications.register.success.message'),
  });
};

// When the request fails
const failed = () => {
  Vue.$notify.error({
    title: Vue.i18n.t('auth.notifications.register.error.title'),
    message: Vue.i18n.t('auth.notifications.register.error.message'),
  });
};

export default user =>
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
      .then(() => {
        success();
      }).catch((error) => {
        failed(error);
      });
