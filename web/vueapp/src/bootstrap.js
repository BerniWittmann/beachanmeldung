/* ============
 * Bootstrap File
 * ============
 *
 * Will configure and bootstrap the application.
 */


/* ============
 * Vue
 * ============
 *
 * Vue.js is a library for building interactive web interfaces.
 * It provides data-reactive components with a simple and flexible API.
 *
 * http://rc.vuejs.org/guide/
 */
import Vue from 'vue';

Vue.config.debug = process.env.NODE_ENV !== 'production';

import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';

if (!Vue.config.debug) {
  Raven
    .config(process.env.SENTRY_DSN)
    .addPlugin(RavenVue, Vue)
    .install();
}


/* ============
 * Vue i18n
 * ============
 *
 * Internationalization plugin of Vue.js.
 *
 * https://kazupon.github.io/vue-i18n/
 */
import VueI18n from 'vue-i18n';
import messages from './locale';

Vue.use(VueI18n);

export const i18n = new VueI18n({
  locale: 'de',
  fallbackLocale: 'de',
  messages,
});

Vue.i18n = i18n;

import moment from 'moment';

moment.locale('de');


/* ============
 * Vuex Router Sync
 * ============
 *
 * Effortlessly keep vue-Router and vuex store in sync.
 *
 * https://github.com/vuejs/vuex-router-sync/blob/master/README.md
 */
import VuexRouterSync from 'vuex-router-sync';
import store from './store';


/* ============
 * Vue Router
 * ============
 *
 * The official Router for Vue.js. It deeply integrates with Vue.js core
 * to make building Single Page Applications with Vue.js a breeze.
 *
 * http://router.vuejs.org/en/index.html
 */
import VueRouter from 'vue-router';
import routes from './routes';
import navigationGuards from './utils/navigationGuards';

Vue.use(VueRouter);

export const router = new VueRouter({
  mode: 'history',
  routes,
});
router.beforeEach(navigationGuards.getBeforeAll(store));
router.afterEach(navigationGuards.getAfterAll(store));
VuexRouterSync.sync(store, router);

Vue.router = router;

/* ============
 * Axios
 * ============
 *
 * Promise based HTTP client for the browser and node.js.
 * Because Vue Resource has been retired, Axios will now been used
 * to perform AJAX-requests.
 *
 * https://github.com/mzabriskie/axios
 */
import Axios from 'axios';
import authService from '@/services/auth';

Axios.defaults.baseURL = process.env.API_LOCATION;
Axios.defaults.headers.common.Accept = 'application/json';
Axios.interceptors.request.use(
  (request) => {
    store.dispatch('loading/set');
    return request;
  },
  error => Promise.reject(error));
Axios.interceptors.response.use(
  (response) => {
    store.dispatch('loading/unset');
    return response;
  },
  (error) => {
    store.dispatch('loading/unset');
    if (error.response.status === 401) {
      authService.logout();
    }
    return Promise.reject(error);
  });

Vue.$http = Axios;
Object.defineProperty(Vue.prototype, '$http', {
  get() {
    return Axios;
  },
});

store.dispatch('auth/check');


/* ============
 * jQuery
 * ============
 *
 * Require jQuery
 *
 * http://jquery.com/
 */
import jQuery from 'jquery';

window.$ = window.jQuery = jQuery;


/* ============
 * Normalize.cc
 * ============
 *
 * Require Normalize
 *
 * http://necolas.github.io/normalize.css/
 */

import 'normalize.css';

/* ============
 * Element UI
 * ============
 *
 * Require UI Suite.
 *
 * http://element.eleme.io
 */
import './assets/style/element-variables.scss';
import 'element-ui/lib/theme-chalk/display.css';
import ElementUI, { Loading, MessageBox, Notification, Message } from 'element-ui';

Vue.use(ElementUI, {
  i18n: key => i18n.t(key),
});

Vue.$loading = Loading.service;
Vue.$msgbox = MessageBox;
Vue.$alert = MessageBox.alert;
Vue.$confirm = MessageBox.confirm;
Vue.$prompt = MessageBox.prompt;
Vue.$notify = Notification;
Vue.$message = Message;


/* ============
 * Font Awesome
 * ============
 *
 * Require font-awesome.
 *
 * http://http://fontawesome.io/
 */
require('font-awesome/less/font-awesome.less');


/* ============
 * Styling
 * ============
 *
 * Require the application styling.
 * Scss is used for this boilerplate.
 */
require('./assets/style/app.scss');


export default {
  router,
  i18n,
};
