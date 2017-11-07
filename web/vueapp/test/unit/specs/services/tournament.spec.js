import tournamentService from '@/services/tournament';
import moxios from 'moxios';
import sinon from 'sinon';
import axios from 'axios';
import Vue from 'vue';

describe('Services', () => {
  describe('Tournamnet', () => {
    const notification = {
      error: sinon.stub(),
    };

    beforeEach(() => {
      moxios.install();
      notification.error = sinon.stub();
      Vue.$notify = notification;
      Vue.$http = axios;
      Vue.i18n.t = key => key;
    });

    afterEach(() => {
      moxios.uninstall();
    });

    describe('getAll', () => {
      it('should load all tournaments', (done) => {
        moxios.stubRequest('/test/tournaments/', {
          status: 200,
          response: [{
            id: 1,
            name: 'Test Turnier',
            gender: 'male',
            signupOpen: true,
            startingFee: '60.00',
          }],
        });

        const onFulfilled = sinon.spy();
        tournamentService.getAll().then(onFulfilled);

        moxios.wait(() => {
          expect(onFulfilled.called).to.equal(true);
          done();
        });
      });

      it('should handle fail', (done) => {
        moxios.stubRequest('/test/tournaments/', {
          status: 400,
        });

        const onFulfilled = sinon.spy();
        tournamentService.getAll().then(onFulfilled);

        moxios.wait(() => {
          expect(onFulfilled.called).to.equal(true);
          done();
        });
      });

      it('should show notification on fail', (done) => {
        moxios.stubRequest('/test/tournaments/', {
          status: 400,
        });

        const onFulfilled = sinon.spy();
        tournamentService.getAll().then(onFulfilled);

        moxios.wait(() => {
          expect(onFulfilled.called).to.equal(true);
          expect(notification.error.called).to.equal(true);
          expect(notification.error.getCall(0).args[0]).to.deep.equal({
            title: 'tournament.notifications.get.failed.title',
            message: 'tournament.notifications.get.failed.message',
          });
          done();
        });
      });
    });

    describe('getByID', () => {
      it('should load a tournament', (done) => {
        moxios.stubRequest('/test/tournaments/1/', {
          status: 200,
          response: [{
            id: 1,
            name: 'Test Turnier',
            gender: 'male',
            signupOpen: true,
            startingFee: '60.00',
          }],
        });

        const onFulfilled = sinon.spy();
        tournamentService.getByID(1).then(onFulfilled);

        moxios.wait(() => {
          expect(onFulfilled.called).to.equal(true);
          done();
        });
      });

      it('should handle fail', (done) => {
        moxios.stubRequest('/test/tournaments/1/', {
          status: 400,
        });

        const onFulfilled = sinon.spy();
        tournamentService.getByID(1).then(onFulfilled);

        moxios.wait(() => {
          expect(onFulfilled.called).to.equal(true);
          done();
        });
      });

      it('should show notification on fail', (done) => {
        moxios.stubRequest('/test/tournaments/1/', {
          status: 400,
        });

        const onFulfilled = sinon.spy();
        tournamentService.getByID(1).then(onFulfilled);

        moxios.wait(() => {
          expect(onFulfilled.called).to.equal(true);
          expect(notification.error.called).to.equal(true);
          expect(notification.error.getCall(0).args[0]).to.deep.equal({
            title: 'tournament.notifications.get.failed.title',
            message: 'tournament.notifications.get.failed.message',
          });
          done();
        });
      });
    });
  });
});
