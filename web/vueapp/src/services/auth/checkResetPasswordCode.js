import Vue from 'vue';

// When the request succeeds
const success = () => {
};

// When the request fails
const failed = () => {
  Vue.router.replace({
    name: 'auth.registration',
  });
  Vue.$notify.error({
    title: Vue.i18n.t('auth.notifications.check_password_code.error.title'),
    message: Vue.i18n.t('auth.notifications.check_password_code.error.message'),
  });
};

export default code =>
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
   Vue.$http.get('account/password/reset/verify/', { params: { code } })
      .then(() => {
        success();
      })
      .catch(() => {
        failed();
      });
