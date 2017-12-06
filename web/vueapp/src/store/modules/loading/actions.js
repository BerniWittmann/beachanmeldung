/* ============
 * Actions for the loading module
 * ============
 *
 * The actions that are available on the
 * loading module.
 */

import * as types from './mutation-types';
import { Loading } from 'element-ui';

export const set = ({ commit }) => {
  commit(types.SET);
};

export const unset = ({ commit }) => {
  commit(types.UNSET);
};

let loadingObj;

export const setNavigation = ({ commit }) => {
  loadingObj = Loading.service({
    lock: true,
  });
  commit(types.SET_NAVIGATION);
};

export const unsetNavigation = ({ commit }) => {
  if (loadingObj) {
    loadingObj.close();
  }
  commit(types.UNSET_NAVIGATION);
};

export default {
  set,
  unset,
  setNavigation,
  unsetNavigation,
};
