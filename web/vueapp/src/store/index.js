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
import team from './modules/team';
import player from './modules/player';
import config from './modules/config';

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
    team,
    player,
    config,
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
