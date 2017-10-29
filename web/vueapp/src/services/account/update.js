import accountTransformer from './../../transformers/account';
import store from './../../store';
import Vue from 'vue';

// When the request succeeds
const success = (data) => {
  store.dispatch('account/store', accountTransformer.fetch(data.user));
  if (data.email_sent) {
    Vue.$notify.success({
      title: Vue.i18n.t('auth.notifications.register.validate_email.title'),
      message: Vue.i18n.t('auth.notifications.register.validate_email.message'),
    });
  }
  if (data.token) {
    store.dispatch('auth/login', data.token);
  }
};

// When the request fails
const failed = () => {
};

export default data =>
  /*
   * Normally you would perform an AJAX-request.
   * But to get the example working, the data is hardcoded.
   *
   * With the include REST-client Axios, you can do something like this:
   * Vue.$http.get('/account')
   *   .then((response) => {
   *     success(response);
   *   })
   *   .catch((error) => {
   *     failed(error);
   *   });
   */
  Vue.$http.put('/account/users/me/', accountTransformer.send(data))
    .then((response) => {
      success(response.data);
    }).catch((error) => {
      failed(error);
    });
