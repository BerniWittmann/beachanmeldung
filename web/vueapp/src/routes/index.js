/* ============
 * Routes File
 * ============
 *
 * The routes and redirects are defined in this file.
 */

import tournamentService from '@/services/tournament';
import teamService from '@/services/team';
import store from '@/store';
import moment from 'moment';
import Vue from 'vue';

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

    beforeEnter: (to, from, next) => {
      Promise.all([
        tournamentService.getAll(),
        teamService.getMine(),
      ]).catch(next).then(next);
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

    beforeEnter: (to, from, next) => teamService.getMine().then(next),
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

  // ComingSoon Page
  {
    path: '/coming-soon',
    name: 'etc.comingSoon',
    component: require('@/pages/etc/comingSoon.vue'),

    // If the user needs to be a authenticated to view this page
    meta: {
      auth: false,
    },
  },

  {
    path: '/contact',
    name: 'etc.contact',
    component: require('@/pages/etc/contact.vue'),

    // If the user needs to be a authenticated to view this page
    meta: {
      auth: false,
    },
  },

  {
    path: '/privacy',
    name: 'etc.privacy',
    component: require('@/pages/etc/privacy.vue'),

    // If the user needs to be a authenticated to view this page
    meta: {
      auth: false,
    },
  },

  {
    path: '/register-team',
    name: 'team.register',
    component: require('@/pages/team/signup.vue'),

    // If the user needs to be a authenticated to view this page
    meta: {
      auth: false,
    },

    beforeEnter: (to, from, next) => {
      Promise.all([
        tournamentService.getAll(),
        tournamentService.setCurrentSignupTournament(to.query.tournament),
      ]).catch(next).then(next);
    },
  },

  // Tournament Single Page
  {
    path: '/tournament/:tournamentID',
    component: require('@/pages/tournament/wrapper.vue'),
    // If the user needs to be a authenticated to view this page
    meta: {
      auth: false,
    },

    beforeEnter: (to, from, next) => {
      Promise.all([
        tournamentService.getByID(to.params.tournamentID),
        teamService.getAll(),
      ]).then(next);
    },

    children: [
      {
        path: '',
        name: 'tournament.single',
        component: require('@/pages/tournament/single.vue'),
      }, {
        // Team Single Page
        path: 'team/:teamID',
        component: require('@/pages/team/wrapper.vue'),

        beforeEnter: (to, from, next) => {
          if (teamService.checkIsAllowedToViewTeam(to.params.teamID)) {
            return teamService.getByID(to.params.teamID).then(next);
          }
          return next(!from.name ? { name: 'home.index' } : false);
        },

        auth: true,

        children: [
          {
            path: '',
            name: 'team.single',
            component: require('@/pages/team/single.vue'),
          }, {
            path: 'edit',
            name: 'team.edit',
            component: require('@/pages/team/edit.vue'),

            beforeEnter: (to, from, next) => {
              if (store.state.account.isStaff) return next();
              const currentTournament = store.state.tournament.currentTournament || {};
              if (moment().isBefore(currentTournament.deadlineEdit)) {
                return next();
              }
              Vue.$notify.error({
                title: Vue.i18n.t('team.notifications.put.after_deadline_edit.title'),
                message: Vue.i18n.t('team.notifications.put.after_deadline_edit.message'),
              });
              return next(!from.name ? { name: 'home.index' } : false);
            },
          },
        ],
      }],
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
