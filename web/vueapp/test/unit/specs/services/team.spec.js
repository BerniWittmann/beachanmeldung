import teamService from '@/services/team';
import moxios from 'moxios';
import sinon from 'sinon';
import axios from 'axios';
import Vue from 'vue';

describe('Services', () => {
  describe('Team', () => {
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
      it('should load all teams', (done) => {
        moxios.stubRequest('/test/teams/', {
          status: 200,
          response: [{
            id: 1,
            name: 'Team',
            beachname: 'Beach Name',
          }],
        });

        const onFulfilled = sinon.spy();
        teamService.getAll().then(onFulfilled);

        moxios.wait(() => {
          expect(onFulfilled.called).to.equal(true);
          done();
        });
      });

      it('should handle fail', (done) => {
        moxios.stubRequest('/test/teams/', {
          status: 400,
        });

        const onFulfilled = sinon.spy();
        teamService.getAll().then(onFulfilled);

        moxios.wait(() => {
          expect(onFulfilled.called).to.equal(true);
          done();
        });
      });

      it('should show notification on fail', (done) => {
        moxios.stubRequest('/test/teams/', {
          status: 400,
        });

        const onFulfilled = sinon.spy();
        teamService.getAll().then(onFulfilled);

        moxios.wait(() => {
          expect(onFulfilled.called).to.equal(true);
          expect(notification.error.called).to.equal(true);
          expect(notification.error.getCall(0).args[0]).to.deep.equal({
            title: 'team.notifications.get.failed.title',
            message: 'team.notifications.get.failed.message',
          });
          done();
        });
      });
    });

    describe('getByID', () => {
      it('should load a team', (done) => {
        moxios.stubRequest('/test/teams/1/', {
          status: 200,
          response: [{
            id: 1,
            name: 'Test Team',
            beachnmae: 'THC Eh Drin!',
          }],
        });

        const onFulfilled = sinon.spy();
        teamService.getByID(1).then(onFulfilled);

        moxios.wait(() => {
          expect(onFulfilled.called).to.equal(true);
          done();
        });
      });

      it('should handle fail', (done) => {
        moxios.stubRequest('/test/teams/1/', {
          status: 400,
        });

        const onFulfilled = sinon.spy();
        teamService.getByID(1).then(onFulfilled);

        moxios.wait(() => {
          expect(onFulfilled.called).to.equal(true);
          done();
        });
      });

      it('should show notification on fail', (done) => {
        moxios.stubRequest('/test/teams/1/', {
          status: 400,
        });

        const onFulfilled = sinon.spy();
        teamService.getByID(1).then(onFulfilled);

        moxios.wait(() => {
          expect(onFulfilled.called).to.equal(true);
          expect(notification.error.called).to.equal(true);
          expect(notification.error.getCall(0).args[0]).to.deep.equal({
            title: 'team.notifications.get.failed.title',
            message: 'team.notifications.get.failed.message',
          });
          done();
        });
      });
    });

    describe('create', () => {
      it('should create a team', (done) => {
        moxios.stubRequest('/test/teams/', {
          status: 200,
          response: {
            id: 1,
            name: 'Test Team',
            beachnmae: 'THC Eh Drin!',
          },
        });

        const onFulfilled = sinon.spy();
        teamService.create({ id: 1, name: 'Test Team'}).then(onFulfilled);

        moxios.wait(() => {
          expect(onFulfilled.called).to.equal(true);
          done();
        });
      });

      it('should handle fail', (done) => {
        moxios.stubRequest('/test/teams/', {
          status: 400,
        });

        const onFulfilled = sinon.spy();
        teamService.create({ id: 1, name: 'Test Team'}).then(onFulfilled);

        moxios.wait(() => {
          expect(onFulfilled.called).to.equal(true);
          done();
        });
      });

      it('should show notification on fail', (done) => {
        moxios.stubRequest('/test/teams/', {
          status: 400,
        });

        const onFulfilled = sinon.spy();
        teamService.create({ id: 1, name: 'Test Team'}).then(onFulfilled);

        moxios.wait(() => {
          expect(onFulfilled.called).to.equal(true);
          expect(notification.error.called).to.equal(true);
          expect(notification.error.getCall(0).args[0]).to.deep.equal({
            title: 'team.notifications.post.failed.title',
            message: 'team.notifications.post.failed.message',
          });
          done();
        });
      });
    });

    describe('update', () => {
      it('should update a team', (done) => {
        moxios.stubRequest('/test/teams/1/', {
          status: 200,
          response: {
            id: 1,
            name: 'Test Team',
            beachnmae: 'THC Eh Drin!',
          },
        });

        const onFulfilled = sinon.spy();
        teamService.update({ id: 1, name: 'Test Team'}).then(onFulfilled);

        moxios.wait(() => {
          const lastreq = moxios.requests.mostRecent();
          expect(onFulfilled.called).to.equal(true);
          done();
        });
      });

      it('should handle fail', (done) => {
        moxios.stubRequest('/test/teams/1/', {
          status: 400,
        });

        const onFulfilled = sinon.spy();
        teamService.update({ id: 1, name: 'Test Team'}).then(onFulfilled);

        moxios.wait(() => {
          expect(onFulfilled.called).to.equal(true);
          done();
        });
      });

      it('should show notification on fail', (done) => {
        moxios.stubRequest('/test/teams/1/', {
          status: 400,
        });

        const onFulfilled = sinon.spy();
        teamService.update({ id: 1, name: 'Test Team'}).then(onFulfilled);

        moxios.wait(() => {
          expect(onFulfilled.called).to.equal(true);
          expect(notification.error.called).to.equal(true);
          expect(notification.error.getCall(0).args[0]).to.deep.equal({
            title: 'team.notifications.put.failed.title',
            message: 'team.notifications.put.failed.message',
          });
          done();
        });
      });
    });
  });
});
