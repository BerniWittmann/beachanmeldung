import Vue from 'vue';
import store from './../../store';

export default () => {
  if (store.state.auth.authenticated) {
    Vue.$http.get('/account/logout/');

    store.dispatch('auth/logout');
    Vue.router.replace({
      name: 'auth.login',
    });
    Vue.$notify.success({
      message: Vue.i18n.t('auth.notifications.logout.success.title'),
    });
  }
};
