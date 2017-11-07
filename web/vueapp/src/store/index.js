/* ============
 * Vuex Store
 * ============
 *
 * The store of the application.
 *
 * http://vuex.vuejs.org/en/index.html
 */

import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';

// Modules
import account from './modules/account';
import auth from './modules/auth';
import loading from './modules/loading';
import tournament from './modules/tournament';

Vue.use(Vuex);

const debug = process.env.NODE_ENV === 'development';

export default new Vuex.Store({
  /**
   * Assign the modules to the store
   */
  modules: {
    account,
    auth,
    loading,
    tournament,
  },

  /**
   * If strict mode should be enabled
   */
  strict: debug,

  /**
   * Plugins used in the store
   */
  plugins: debug ? [createLogger()] : [],
});
