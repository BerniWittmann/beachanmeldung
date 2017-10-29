import EmailVerify from '@/pages/auth/email-verify';
import Vuex from 'vuex';
import moxios from 'moxios';
import utils from '../../../utils';

describe('Pages', () => {
  describe('Email Verify', () => {
    const state = {
      auth: { authenticated: false },
    };
    let store;
    beforeEach(() => {
      store = new Vuex.Store({
        state,
      });
      moxios.install();
    });

    afterEach(() => {
      moxios.uninstall();
    });

    it('should show a message', () => {
      const vm = utils.mountComponent(EmailVerify, { store });
      expect(vm.text()).to.contain('auth.verifying_email');
    });

    it('should have a link to registration', () => {
      const vm = utils.mountComponent(EmailVerify, { store });
      const link = vm.first('.panel-footer').first('a');
      expect(link.hasAttribute('href', '/signup')).to.equal(true);
    });

    it('should check the code when mounted', (done) => {
      utils.mountComponent(EmailVerify, { store });
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        expect(request.config.url).to.equal('/test/account/signup/verify/');
        expect(request.config.params).to.deep.equal({ code: undefined });
        return done();
      });
    });
  });
});
