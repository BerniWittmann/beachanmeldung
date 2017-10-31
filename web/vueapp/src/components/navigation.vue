<template>
  <el-menu :default-active="this.activeRoute" mode="horizontal" :router="true" class="nav" background-color="#000000" text-color="#FDD648" active-text-color="#F0C70D">
    <router-link
      :to="{ name: 'home.index' }"
      class="nav-image-wrap"
      tag="a"
    >
      <img class="nav-image" src="/static/images/logo.png" :alt="$t('nav.name')">
      <p>Beach - Anmeldung</p>
    </router-link>
    <div class="nav-right">
      <el-menu-item v-if="isLoggedIn" index="auth.account" :route="{ name: 'auth.account' }">{{ $t('nav.account') }}</el-menu-item>
      <el-menu-item @click="logout" v-if="isLoggedIn" index="auth.logout">{{ $t('nav.logout') }}</el-menu-item>
      <el-menu-item v-if="!isLoggedIn" index="auth.login" :route="{ name: 'auth.login' }">{{ $t('nav.login') }}</el-menu-item>
    </div>
  </el-menu>
</template>
<script>
  /* ============
   * Navigation Component
   * ============
   *
   * Navigation Bar component.
   *
   * Renders the navigation Mar.
   */
  import authService from '@/services/auth';

  export default {
    methods: {
      logout() {
        authService.logout();
      },
    },

    computed: {
      isLoggedIn() {
        return this.$store.state.auth.authenticated;
      },
      activeRoute() {
        return this.$route.name;
      },
    },
  };

</script>
