import Vue from 'vue';

// When the request succeeds
const success = () => {
  Vue.router.push({
    name: 'auth.login',
  });
  Vue.$notify.success({
    title: Vue.i18n.t('auth.notifications.forgot_password.success.title'),
    message: Vue.i18n.t('auth.notifications.forgot_password.success.message'),
  });
};

// When the request fails
const failed = () => {
  Vue.$notify.error({
    title: Vue.i18n.t('auth.notifications.forgot_password.error.title'),
    message: Vue.i18n.t('auth.notifications.forgot_password.error.message'),
  });
};

export default user =>
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
   Vue.$http.post('/account/password/reset/', user)
      .then(() => {
        success();
      }).catch((error) => {
        failed(error);
      });
