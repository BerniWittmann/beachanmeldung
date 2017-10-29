/* ============
 * Routes File
 * ============
 *
 * The routes and redirects are defined in this file.
 */
import teamService from '@/services/team';

/**
 * The routes
 *
 * @type {object} The routes
 */
export default [
  // Home
  {
    path: '/home',
    name: 'home.index',
    component: require('@/pages/home/index.vue'),

    // If the user needs to be authenticated to view this page
    meta: {
      auth: false,
    },
  },

  // Account
  {
    path: '/account',
    name: 'auth.account',
    component: require('@/pages/auth/account.vue'),

    // If the user needs to be authenticated to view this page
    meta: {
      auth: true,
    },
  },

  // Login
  {
    path: '/login',
    name: 'auth.login',
    component: require('@/pages/auth/login.vue'),

    // If the user needs to be a guest to view this page
    meta: {
      guest: true,
    },
  },

  // Password Forgot
  {
    path: '/password/forgot',
    name: 'auth.password-forgot',
    component: require('@/pages/auth/password-forgot.vue'),

    // If the user needs to be a guest to view this page
    meta: {
      guest: true,
    },
  },

  // Password Reset
  {
    path: '/password/reset',
    name: 'auth.password-reset',
    component: require('@/pages/auth/password-reset.vue'),

    // If the user needs to be a guest to view this page
    meta: {
      guest: true,
    },
  },

  // Register
  {
    path: '/signup',
    name: 'auth.registration',
    component: require('@/pages/auth/registration.vue'),

    // If the user needs to be a guest to view this page
    meta: {
      guest: true,
    },
  },

  // Email Verify
  {
    path: '/signup/verify',
    name: 'auth.email-verify',
    component: require('@/pages/auth/email-verify.vue'),

    // If the user needs to be a guest to view this page
    meta: {
      auth: false,
    },
  },

  // Team Page
  {
    path: '/team',
    name: 'etc.team',
    component: require('@/pages/etc/team.vue'),

    // If the user needs to be a authenticated to view this page
    meta: {
      auth: false,
    },

    beforeEnter: (to, from, next) => {
      teamService.get();
      next();
    },
  },

  // ComingSoon Page
  {
    path: '/coming-soon',
    name: 'etc.comingSoon',
    component: require('@/pages/etc/comingSoon.vue'),

    // If the user needs to be a authenticated to view this page
    meta: {
      auth: false,
    },

    beforeEnter: (to, from, next) => {
      teamService.get();
      next();
    },
  },

  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/*',
    redirect: '/home',
  },
];
