import accountService from '@/services/account';
import moxios from 'moxios';
import sinon from 'sinon';
import axios from 'axios';
import Vue from 'vue';

describe('Services', () => {
  describe('Account', () => {
    const notification = {
      error: sinon.stub(),
      success: sinon.stub(),
    };

    beforeEach(() => {
      moxios.install();
      notification.error = sinon.stub();
      notification.success = sinon.stub();
      Vue.$notify = notification;
      Vue.$http = axios;
      Vue.i18n.t = key => key;
    });

    afterEach(() => {
      moxios.uninstall();
    });

    describe('find', () => {
      it('should find accout data', (done) => {
        moxios.stubRequest('/test/account/users/me/', {
          status: 200,
          response: { email: 'test@byom.de', nachname: 'User', vorname: 'Test' },
        });

        const onFulfilled = sinon.spy();
        accountService.find().then(onFulfilled);

        moxios.wait(() => {
          expect(onFulfilled.called).to.equal(true);
          done();
        });
      });

      it('should handle fail', (done) => {
        moxios.stubRequest('/test/account/users/me/', {
          status: 400,
        });

        const onFulfilled = sinon.spy();
        accountService.find().then(onFulfilled);

        moxios.wait(() => {
          expect(onFulfilled.called).to.equal(true);
          done();
        });
      });
    });

    describe('update', () => {
      it('should handle fail', (done) => {
        moxios.stubRequest('/test/account/users/me/', {
          status: 400,
        });

        const onFulfilled = sinon.spy();
        accountService.update({ email: 'test@byom.de' }).then(onFulfilled);

        moxios.wait(() => {
          expect(onFulfilled.called).to.equal(true);
          done();
        });
      });

      it('should handle success', (done) => {
        moxios.stubRequest('/test/account/users/me/', {
          status: 200,
          response: {
            user: {
              email: 'test@byom.de',
              last_name: 'User',
              first_name: 'Test',
            },
          },
        });

        const onFulfilled = sinon.spy();
        accountService.update({ email: 'test@byom.de' }).then(onFulfilled);

        moxios.wait(() => {
          expect(onFulfilled.called).to.equal(true);
          done();
        });
      });

      it('should store the user', (done) => {
        moxios.stubRequest('/test/account/users/me/', {
          status: 200,
          response: {
            user: {
              email: 'test@byom.de',
              first_name: 'User',
              last_name: 'Test',
            },
          },
        });

        const onFulfilled = sinon.spy();
        accountService.update({ email: 'test@byom.de' }).then(onFulfilled);

        moxios.wait(() => {
          expect(onFulfilled.called).to.equal(true);
          done();
        });
      });

      it('should show notification if email was sent', (done) => {
        moxios.stubRequest('/test/account/users/me/', {
          status: 200,
          response: {
            user: {
              email: 'test@byom.de',
              first_name: 'User',
              last_name: 'Test',
            },
            email_sent: true,
          },
        });

        const onFulfilled = sinon.spy();
        accountService.update({ email: 'test@byom.de' }).then(onFulfilled);

        moxios.wait(() => {
          expect(onFulfilled.called).to.equal(true);
          expect(notification.success.called).to.equal(true);
          expect(notification.success.getCall(0).args[0]).to.deep.equal({
            title: 'auth.notifications.register.validate_email.title',
            message: 'auth.notifications.register.validate_email.message',
          });
          done();
        });
      });

      it('should store the token', (done) => {
        moxios.stubRequest('/test/account/users/me/', {
          status: 200,
          response: {
            user: {
              email: 'test@byom.de',
              first_name: 'User',
              last_name: 'Test',
            },
            token: '1234abcd',
          },
        });

        const onFulfilled = sinon.spy();
        accountService.update({ email: 'test@byom.de' }).then(onFulfilled);

        moxios.wait(() => {
          expect(onFulfilled.called).to.equal(true);
          done();
        });
      });
    });
  });
});
