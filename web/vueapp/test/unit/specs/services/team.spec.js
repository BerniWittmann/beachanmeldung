import teamService from '@/services/team';
import moxios from 'moxios';
import sinon from 'sinon';
import axios from 'axios';
import Vue from 'vue';

describe('Services', () => {
  describe('Team', () => {
    beforeEach(() => {
      moxios.install();
      Vue.$http = axios;
    });

    afterEach(() => {
      moxios.uninstall();
    });

    describe('get', () => {
      it('should get Team Members', (done) => {
        moxios.stubRequest('/test/team/members/', {
          status: 200,
          response: { results: [{ email: 'test@byom.de', name: 'Aha' }, {}] },
        });

        const onFulfilled = sinon.spy();
        teamService.get().then(onFulfilled);

        moxios.wait(() => {
          expect(onFulfilled.called).to.equal(true);
          done();
        });
      });
    });
  });
});
