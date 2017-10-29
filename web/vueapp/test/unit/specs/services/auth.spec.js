import authService from '@/services/auth';
import moxios from 'moxios';
import sinon from 'sinon';
import axios from 'axios';
import store from '@/store';
import Vue from 'vue';

describe('Services', () => {
  describe('Auth', () => {
    const notification = {
      error: sinon.stub(),
      success: sinon.stub(),
    };

    const router = {
      replace: sinon.stub(),
      push: sinon.stub(),
    };

    beforeEach(() => {
      moxios.install();
      notification.error = sinon.stub();
      notification.success = sinon.stub();
      router.replace = sinon.stub();
      router.push = sinon.stub();
      Vue.$http = axios;
      Vue.$notify = notification;
      Vue.router = router;
      Vue.i18n.t = key => key;
    });

    afterEach(() => {
      moxios.uninstall();
    });

    describe('check Reset Password Code', () => {
      it('should validate Password Reset Code', (done) => {
        moxios.stubRequest('/test/account/password/reset/verify/?code=1234', {
          status: 200,
        });

        const onFulfilled = sinon.spy();
        authService.checkResetPasswordCode('1234').then(onFulfilled);

        moxios.wait(() => {
          expect(onFulfilled.called).to.equal(true);
          expect(notification.error.called).to.equal(false);
          done();
        });
      });

      it('should display a notification with a wrong Code', (done) => {
        moxios.stubRequest('/test/account/password/reset/verify/?code=1234', {
          status: 400,
        });

        const onFulfilled = sinon.spy();
        authService.checkResetPasswordCode('1234').then(onFulfilled);

        moxios.wait(() => {
          expect(onFulfilled.called).to.equal(true);
          expect(notification.error.called).to.equal(true);
          expect(notification.error.getCall(0).args[0]).to.deep.equal({
            title: 'auth.notifications.check_password_code.error.title',
            message: 'auth.notifications.check_password_code.error.message',
          });
          done();
        });
      });

      it('should redirect to registration with a wrong Code', (done) => {
        moxios.stubRequest('/test/account/password/reset/verify/?code=1234', {
          status: 400,
        });

        const onFulfilled = sinon.spy();
        authService.checkResetPasswordCode('1234').then(onFulfilled);

        moxios.wait(() => {
          expect(onFulfilled.called).to.equal(true);
          expect(router.replace.called).to.equal(true);
          expect(router.replace.getCall(0).args[0]).to.deep.equal({ name: 'auth.registration' });
          done();
        });
      });
    });

    describe('Login', () => {
      it('should pass user object to endpoint', (done) => {
        const onFulfilled = sinon.spy();
        authService.login({ username: 'test', password: 'password' }).then(onFulfilled);

        moxios.wait(() => {
          const request = moxios.requests.mostRecent();
          expect(request.config.method).to.equal('post');
          expect(JSON.parse(request.config.data)).to.deep.equal({ username: 'test', password: 'password' });
          done();
        });
      });

      it('should redirect to home after login', (done) => {
        moxios.stubRequest('/test/account/login/', {
          status: 200,
          response: { token: 'token1234' },
        });

        const onFulfilled = sinon.spy();
        authService.login({ username: 'test', password: 'test' }).then(onFulfilled);

        moxios.wait(() => {
          expect(onFulfilled.called).to.equal(true);
          expect(router.push.called).to.equal(true);
          expect(router.push.getCall(0).args[0]).to.deep.equal({ name: 'home.index' });
          done();
        });
      });

      it('should display a notification when account is inactive', (done) => {
        moxios.stubRequest('/test/account/login/', {
          status: 400,
          response: { key: 'account_not_active' },
        });

        const onFulfilled = sinon.spy();
        authService.login({ username: 'test', password: 'test' }).then(onFulfilled);

        moxios.wait(() => {
          expect(onFulfilled.called).to.equal(true);
          expect(notification.error.called).to.equal(true);
          expect(notification.error.getCall(0).args[0]).to.deep.equal({
            title: 'auth.notifications.login.inactive.title',
            message: 'auth.notifications.login.inactive.message',
          });
          done();
        });
      });

      it('should display a notification when account is not verified', (done) => {
        moxios.stubRequest('/test/account/login/', {
          status: 400,
          response: { key: 'account_not_verified' },
        });

        const onFulfilled = sinon.spy();
        authService.login({ username: 'test', password: 'test' }).then(onFulfilled);

        moxios.wait(() => {
          expect(onFulfilled.called).to.equal(true);
          expect(notification.error.called).to.equal(true);
          expect(notification.error.getCall(0).args[0]).to.deep.equal({
            title: 'auth.notifications.login.not_verified.title',
            message: 'auth.notifications.login.not_verified.message',
          });
          done();
        });
      });

      it('should display a notification when an error occurs', (done) => {
        moxios.stubRequest('/test/account/login/', {
          status: 400,
          response: { key: 'not_a_valid_key' },
        });

        const onFulfilled = sinon.spy();
        authService.login({ username: 'test', password: 'test' }).then(onFulfilled);

        moxios.wait(() => {
          expect(onFulfilled.called).to.equal(true);
          expect(notification.error.called).to.equal(true);
          expect(notification.error.getCall(0).args[0]).to.deep.equal({
            title: 'auth.notifications.login.failed.title',
            message: 'auth.notifications.login.failed.message',
          });
          done();
        });
      });
    });

    describe('Logout', () => {
      beforeEach(() => {
        store.dispatch('auth/login', 'exampleToken');
      });

      it('when logged out it should not request the endpoint', (done) => {
        store.dispatch('auth/logout');
        authService.logout();

        moxios.wait(() => {
          const request = moxios.requests.mostRecent();
          expect(request).to.equal(undefined);
          done();
        });
      });

      it('when logged in it should request the endpoint', (done) => {
        authService.logout();

        moxios.wait(() => {
          const request = moxios.requests.mostRecent();
          expect(request.config.url).to.equal('/test/account/logout/');
          done();
        });
      });

      it('it should show a message on success', (done) => {
        authService.logout();

        moxios.wait(() => {
          expect(notification.success.called).to.equal(true);
          expect(notification.success.getCall(0).args[0]).to.deep.equal({
            message: 'auth.notifications.logout.success.title',
          });
          done();
        });
      });

      it('it should redirect to login on success', (done) => {
        authService.logout();

        moxios.wait(() => {
          expect(router.replace.called).to.equal(true);
          expect(router.replace.getCall(0).args[0]).to.deep.equal({
            name: 'auth.login',
          });
          done();
        });
      });
    });

    describe('Register', () => {
      it('should pass user object to endpoint', (done) => {
        const onFulfilled = sinon.spy();
        authService.register({
          email: 'test@byom,de',
          firstName: 'Test',
          lastName: 'User',
          password: 'password',
        }).then(onFulfilled);

        moxios.wait(() => {
          const request = moxios.requests.mostRecent();
          expect(request.config.method).to.equal('post');
          expect(JSON.parse(request.config.data)).to.deep.equal({
            email: 'test@byom,de',
            first_name: 'Test',
            last_name: 'User',
            password: 'password',
          });
          done();
        });
      });

      it('should redirect to login after registration', (done) => {
        moxios.stubRequest('/test/account/signup/', {
          status: 200,
        });

        const onFulfilled = sinon.spy();
        authService.register({}).then(onFulfilled);

        moxios.wait(() => {
          expect(onFulfilled.called).to.equal(true);
          expect(router.push.called).to.equal(true);
          expect(router.push.getCall(0).args[0]).to.deep.equal({ name: 'auth.login' });
          done();
        });
      });

      it('it should show a message on success', (done) => {
        moxios.stubRequest('/test/account/signup/', {
          status: 200,
        });

        authService.register({});

        moxios.wait(() => {
          expect(notification.success.called).to.equal(true);
          expect(notification.success.getCall(0).args[0]).to.deep.equal({
            title: 'auth.notifications.register.success.title',
            message: 'auth.notifications.register.success.message',
          });
          done();
        });
      });

      it('it should show a message on error', (done) => {
        moxios.stubRequest('/test/account/signup/', {
          status: 400,
        });

        authService.register({});

        moxios.wait(() => {
          expect(notification.error.called).to.equal(true);
          expect(notification.error.getCall(0).args[0]).to.deep.equal({
            title: 'auth.notifications.register.error.title',
            message: 'auth.notifications.register.error.message',
          });
          done();
        });
      });
    });

    describe('Request Password', () => {
      it('should pass user object to endpoint', (done) => {
        const onFulfilled = sinon.spy();
        authService.requestPassword({
          email: 'test@byom,de',
        }).then(onFulfilled);

        moxios.wait(() => {
          const request = moxios.requests.mostRecent();
          expect(request.config.method).to.equal('post');
          expect(JSON.parse(request.config.data)).to.deep.equal({
            email: 'test@byom,de',
          });
          done();
        });
      });

      it('should redirect to login after requesting password', (done) => {
        moxios.stubRequest('/test/account/password/reset/', {
          status: 200,
        });

        const onFulfilled = sinon.spy();
        authService.requestPassword({}).then(onFulfilled);

        moxios.wait(() => {
          expect(onFulfilled.called).to.equal(true);
          expect(router.push.called).to.equal(true);
          expect(router.push.getCall(0).args[0]).to.deep.equal({ name: 'auth.login' });
          done();
        });
      });

      it('it should show a message on success', (done) => {
        moxios.stubRequest('/test/account/password/reset/', {
          status: 200,
        });

        authService.requestPassword({});

        moxios.wait(() => {
          expect(notification.success.called).to.equal(true);
          expect(notification.success.getCall(0).args[0]).to.deep.equal({
            title: 'auth.notifications.forgot_password.success.title',
            message: 'auth.notifications.forgot_password.success.message',
          });
          done();
        });
      });

      it('it should show a message on error', (done) => {
        moxios.stubRequest('/test/account/password/reset/', {
          status: 400,
        });

        authService.requestPassword({});

        moxios.wait(() => {
          expect(notification.error.called).to.equal(true);
          expect(notification.error.getCall(0).args[0]).to.deep.equal({
            title: 'auth.notifications.forgot_password.error.title',
            message: 'auth.notifications.forgot_password.error.message',
          });
          done();
        });
      });
    });

    describe('Reset Password', () => {
      it('should pass user object to endpoint', (done) => {
        const onFulfilled = sinon.spy();
        authService.requestPassword({
          email: 'test@byom,de',
          password: 'pawned',
        }).then(onFulfilled);

        moxios.wait(() => {
          const request = moxios.requests.mostRecent();
          expect(request.config.method).to.equal('post');
          expect(JSON.parse(request.config.data)).to.deep.equal({
            email: 'test@byom,de',
            password: 'pawned',
          });
          done();
        });
      });

      it('should redirect to login after resetting password', (done) => {
        moxios.stubRequest('/test/account/password/reset/verified/', {
          status: 200,
        });

        const onFulfilled = sinon.spy();
        authService.resetPassword({}).then(onFulfilled);

        moxios.wait(() => {
          expect(onFulfilled.called).to.equal(true);
          expect(router.push.called).to.equal(true);
          expect(router.push.getCall(0).args[0]).to.deep.equal({ name: 'auth.login' });
          done();
        });
      });

      it('it should show a message on success', (done) => {
        moxios.stubRequest('/test/account/password/reset/verified/', {
          status: 200,
        });

        authService.resetPassword({});

        moxios.wait(() => {
          expect(notification.success.called).to.equal(true);
          expect(notification.success.getCall(0).args[0]).to.deep.equal({
            title: 'auth.notifications.password_reset.success.title',
            message: 'auth.notifications.password_reset.success.message',
          });
          done();
        });
      });

      it('it should show a message on error', (done) => {
        moxios.stubRequest('/test/account/password/reset/verified/', {
          status: 400,
        });

        authService.resetPassword({});

        moxios.wait(() => {
          expect(notification.error.called).to.equal(true);
          expect(notification.error.getCall(0).args[0]).to.deep.equal({
            title: 'auth.notifications.password_reset.error.title',
            message: 'auth.notifications.password_reset.error.message',
          });
          done();
        });
      });
    });

    describe('Verify E-Mail', () => {
      it('should pass code to endpoint as param', (done) => {
        moxios.stubRequest('/test/account/signup/verify/?code=1234', {
          status: 200,
        });

        const onFulfilled = sinon.spy();
        authService.verifyEmail('1234').then(onFulfilled);

        moxios.wait(() => {
          expect(onFulfilled.called).to.equal(true);
          const request = moxios.requests.mostRecent();
          expect(request.config.method).to.equal('get');
          expect(request.config.params).to.deep.equal({ code: '1234' });
          done();
        });
      });

      it('should redirect to login after verifying email', (done) => {
        moxios.stubRequest('/test/account/signup/verify/?code=1234', {
          status: 200,
        });

        const onFulfilled = sinon.spy();
        authService.verifyEmail('1234').then(onFulfilled);

        moxios.wait(() => {
          expect(onFulfilled.called).to.equal(true);
          expect(router.replace.called).to.equal(true);
          expect(router.replace.getCall(0).args[0]).to.deep.equal({ name: 'auth.login' });
          done();
        });
      });

      it('it should show a message on success', (done) => {
        moxios.stubRequest('/test/account/signup/verify/?code=1234', {
          status: 200,
        });

        authService.verifyEmail('1234');

        moxios.wait(() => {
          expect(notification.success.called).to.equal(true);
          expect(notification.success.getCall(0).args[0]).to.deep.equal({
            title: 'auth.notifications.email_verify.success.title',
            message: 'auth.notifications.email_verify.success.message',
          });
          done();
        });
      });

      it('it should show a message on error', (done) => {
        moxios.stubRequest('/test/account/signup/verify/?code=1234', {
          status: 400,
        });

        authService.verifyEmail('1234');

        moxios.wait(() => {
          expect(notification.error.called).to.equal(true);
          expect(notification.error.getCall(0).args[0]).to.deep.equal({
            title: 'auth.notifications.email_verify.error.title',
            message: 'auth.notifications.email_verify.error.message',
          });
          done();
        });
      });

      it('should redirect to registration after error', (done) => {
        moxios.stubRequest('/test/account/signup/verify/?code=1234', {
          status: 400,
        });

        const onFulfilled = sinon.spy();
        authService.verifyEmail('1234').then(onFulfilled);

        moxios.wait(() => {
          expect(onFulfilled.called).to.equal(true);
          expect(router.replace.called).to.equal(true);
          expect(router.replace.getCall(0).args[0]).to.deep.equal({ name: 'auth.registration' });
          done();
        });
      });
    });
  });
});
