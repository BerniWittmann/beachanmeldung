import auth from '@/store/modules/auth';
import Vue from 'vue';
import { CHECK, LOGIN, LOGOUT } from '@/store/modules/auth/mutation-types';
import utils from '../../utils';
import sinon from 'sinon';

describe('Vuex Modules', () => {
  describe('Auth', () => {
    afterEach(() => {
      localStorage.removeItem('id_token');
    });

    it('should be namespaced', () => {
      expect(auth.namespaced).to.equal(true);
    });

    describe('Mutations', () => {
      describe('CHECK', () => {
        it('should check if user is logged out', () => {
          const state = {};
          auth.mutations[CHECK](state);

          expect(state.authenticated).to.equal(false);
          expect(Vue.$http.defaults.headers.common.Authorization).to.equal('');
        });

        it('should check if the user is logged in', () => {
          const state = { authenticated: true };
          localStorage.setItem('id_token', 'example_token');
          auth.mutations[CHECK](state);

          expect(state.authenticated).to.equal(true);
          expect(Vue.$http.defaults.headers.common.Authorization).to.equal('JWT example_token');
        });
      });

      describe('LOGOUT', () => {
        it('should log the user out', () => {
          const state = { authenticated: true };
          localStorage.setItem('id_token', 'example_token');
          Vue.$http.defaults.headers.common.Authorization = 'JWT example_token';

          auth.mutations[LOGOUT](state);

          expect(state.authenticated).to.equal(false);
          expect(localStorage.getItem('id_token')).to.equal(null);
          expect(Vue.$http.defaults.headers.common.Authorization).to.equal('');
        });
      });

      describe('LOGIN', () => {
        it('should log the user in', () => {
          const state = {};
          auth.mutations[LOGIN](state, 'example_token');

          expect(state.authenticated).to.equal(true);
          expect(localStorage.getItem('id_token')).to.equal('example_token');
          expect(Vue.$http.defaults.headers.common.Authorization).to.equal('JWT example_token');
        });
      });
    });

    describe('Actions', () => {
      it('check Auth State', (done) => {
        utils.testAction(auth.actions.check, null, {}, [
          { type: 'CHECK' },
        ], done);
      });

      it('login', (done) => {
        utils.testAction(auth.actions.login, '12345', {}, [
          { type: 'LOGIN', payload: '12345' },
        ], done);
      });

      it('logout', (done) => {
        utils.testAction(auth.actions.logout, null, {}, [
          { type: 'LOGOUT' },
        ], done, sinon.stub());
      });
    });

    describe.skip('Getters');
  });
});
