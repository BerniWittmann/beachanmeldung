<template>
    <el-menu :default-active="this.activeRoute" mode="horizontal" :router="true" class="nav" background-color="#000000"
             text-color="#FDD648" active-text-color="#F0C70D">
        <router-link
                :to="{ name: 'home.index' }"
                class="nav-image-wrap"
                tag="a"
        >
            <div class="nav-image"></div>
            <p class="hidden-sm-and-down" v-if="!displayBackButton">{{ $t('nav.name') }}</p>
            <v-link-button v-else :route="backRouteConfig.route" icon="el-icon-arrow-left" type="text">
                {{ backRouteConfig.text }}
            </v-link-button>
        </router-link>
        <div class="nav-right">
            <el-menu-item v-if="isLoggedIn" index="auth.account" :route="{ name: 'auth.account' }">{{ $t('nav.account')
                }}
            </el-menu-item>
            <el-menu-item @click="logout" v-if="isLoggedIn" index="auth.logout">{{ $t('nav.logout') }}</el-menu-item>
            <el-menu-item v-if="!isLoggedIn" index="auth.login" :route="{ name: 'auth.login' }">{{ $t('nav.login') }}
            </el-menu-item>
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
   * Renders the navigation Bar.
   */
  import authService from '@/services/auth';

  export default {
    components: {
      VLinkButton: require('@/components/linkButton.vue'),
    },

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
      displayBackButton() {
        return ['team.single', 'team.edit'].includes(this.activeRoute);
      },
      backRouteConfig() {
        switch (this.activeRoute) {
          case 'team.single':
            return {
              text: this.$t('nav.back_to.tournament'),
              route: { name: 'tournament.single', params: this.$route.params },
            };
          case 'team.edit':
            return {
              text: this.$t('nav.back_to.team'),
              route: { name: 'team.single', params: this.$route.params },
            };
          default:
            return {
              text: this.$t('nav.name'),
              route: { name: 'home.index' },
            };
        }
      },
    },
  };

</script>
