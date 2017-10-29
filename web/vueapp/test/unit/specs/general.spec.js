import Vue from 'vue';
import store from '@/store';
import moxios from 'moxios';
import utils from '../utils';
import App from '@/app';

describe('App', () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('should render the app', () => {
    const vm = utils.mountComponent(App);
    expect(vm.isEmpty()).to.equal(false);
  });

  it('should find the account if authenticated', (done) => {
    store.dispatch('auth/login', '1234');
    utils.mountComponent(App);

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      expect(request.config.url).to.equal('/test/account/users/me/');
      done();
    });
  });
});

describe('Axios', () => {
  describe('Interceptors', () => {
    beforeEach(() => {
      moxios.install();
    });

    afterEach(() => {
      moxios.uninstall();
    });

    it('should get Axios instance from Vue', () => {
      const axios = Vue.prototype.$http.get();
      expect(axios).not.to.equal(undefined);
    });

    describe('Request Interceptor', () => {
      it('should set loading state', (done) => {
        Vue.$http.get('/test');

        moxios.wait(() => {
          expect(store.state.loading.loading).to.equal(true);
          done();
        });
      });
    });

    describe('Response Interceptor', () => {
      it('should unset loading state', (done) => {
        moxios.stubRequest('/test/hello', {
          status: 200,
          responseText: 'hello',
        });

        Vue.$http.get('/hello');

        moxios.wait(() => {
          expect(store.state.loading.loading).to.equal(false);
          done();
        });
      });

      it('should unset loading state on failing request', (done) => {
        moxios.stubRequest('/test/hello', {
          status: 400,
        });

        Vue.$http.get('/hello');

        moxios.wait(() => {
          expect(store.state.loading.loading).to.equal(false);
          done();
        });
      });

      it('should log user out on 401', (done) => {
        store.state.auth.authenticated = true;

        moxios.stubRequest('/test/hello', {
          status: 401,
          responseText: 'hello',
        });

        Vue.$http.get('/hello').then(() => {
          done(new Error('Request should fail'));
        }, () => {
          moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            expect(request.config.url).to.equal('/test/account/logout/');
            done();
          });
        });
      });
    });
  });
});
