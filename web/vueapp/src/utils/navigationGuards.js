let store;
import Vue from 'vue';

function beforeAll(to, from, next) {
  store.dispatch('loading/setNavigation');
  if (to.matched.some(m => m.meta.auth) && !store.state.auth.authenticated) {
    /*
     * If the user is not authenticated and visits
     * a page that requires authentication, redirect to the login page
     */
    next({
      name: 'auth.login',
    });
  } else if (to.matched.some(m => m.meta.guest) && store.state.auth.authenticated) {
    /*
     * If the user is authenticated and visits
     * an guest page, redirect to the dashboard page
     */
    next({
      name: 'home.index',
    });
  } else {
    next();
  }
}

// decorator to inject store
function getBeforeAll(currentStore) {
  store = currentStore;
  return beforeAll;
}

function afterAll() {
  Vue.nextTick(() => {
    store.dispatch('loading/unsetNavigation');
  });
}

// decorator to inject store
function getAfterAll(currentStore) {
  store = currentStore;
  return afterAll;
}

export default { getBeforeAll, getAfterAll };
