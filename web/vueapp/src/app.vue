<template>
    <div id="app" >
        <transition>
            <router-view></router-view>
        </transition>
    </div>
</template>
<script>
  /* ============
   * Entry Point
   * ============
   *
   * The entry point of the application
   */

  import store from './store';
  import { router, i18n } from './bootstrap';
  import accountService from './services/account';
  import { checkCookie, checkLocalStorageAvailable } from './utils/cookieNotification';
  import checkEmailVerification from './utils/emailVerificationNotification';

  export default {
    /**
     * The Vuex store
     */
    store,

    /**
     * The router
     */
    router,

    /**
     * The localization plugin
     */
    i18n,

    /**
     * Fires when the app has been mounted
     */
    mounted() {
      // If the user is authenticated,
      // fetch the data from the API
      if (this.$store.state.auth.authenticated) {
        accountService.find();
      }
      checkLocalStorageAvailable();
      setTimeout(checkCookie, 2000);
      setTimeout(checkEmailVerification, 10000);
    },

    computed: {
      showNavigationLoading() {
        return this.$store.getters['loading/isNavigationLoading'];
      },
    },
  };
</script>
