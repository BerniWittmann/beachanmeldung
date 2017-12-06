/* ============
 * Getters for the loading module
 * ============
 *
 * The getters that are available on the
 * loading module.
 */

export default {
  isLoading(state) {
    return state.loading;
  },
  isNavigationLoading(state) {
    return state.loadingNavigation;
  },
};
