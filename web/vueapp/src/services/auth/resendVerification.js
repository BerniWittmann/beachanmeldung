import Vue from 'vue';

// When the request succeeds
const success = () => {
  Vue.$notify.success({
    title: Vue.i18n.t('auth.notifications.email_verification_sent.success.title'),
    message: Vue.i18n.t('auth.notifications.email_verification_sent.success.message'),
  });
};

// When the request fails
const failed = () => {
  Vue.$notify.error({
    title: Vue.i18n.t('auth.notifications.email_verification_sent.error.title'),
    message: Vue.i18n.t('auth.notifications.email_verification_sent.error.message'),
  });
};

export default () =>
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
   Vue.$http.post('account/resend_verification/')
      .then(success)
      .catch(failed);
