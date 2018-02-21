/* ============
 * Main File
 * ============
 *
 * Will initialize the application.
 */

import Vue from 'vue';
import * as App from './app';

require('./bootstrap');

import configService from '@/services/config';

configService.getConfig().then(() => {
  new Vue(App).$mount('#app');
});
