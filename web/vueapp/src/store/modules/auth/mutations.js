/* ============
 * Mutations for the auth module
 * ============
 *
 * The mutations that are available on the
 * account module.
 */

import Vue from 'vue';
import moment from 'moment';

import { CHECK, LOGIN, LOGOUT } from './mutation-types';

import storageService from '@/services/storage';
import { parseJwt } from '@/utils/helpers';

export default {
  [CHECK](state) {
    const token = storageService.getItem('id_token');
    if (token) {
      if (moment().isBefore(moment.unix(parseJwt(token).exp))) {
        state.authenticated = true;
        Vue.$http.defaults.headers.common.Authorization = `JWT ${token}`;
        return;
      }
      storageService.removeItem('id_token');
    }
    state.authenticated = false;
  },

  [LOGIN](state, token) {
    state.authenticated = true;
    storageService.setItem('id_token', token);
    Vue.$http.defaults.headers.common.Authorization = `JWT ${token}`;
  },

  [LOGOUT](state) {
    state.authenticated = false;
    storageService.removeItem('id_token');
    Vue.$http.defaults.headers.common.Authorization = '';
  },
};
