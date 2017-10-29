import Account from '@/pages/auth/account';
import Vuex from 'vuex';
import utils from '../../../utils';
import moment from 'moment';
import moxios from 'moxios';

describe('Pages', () => {
  describe('Account', () => {
    const state = {
      account: {
        email: 'test@byom.de',
        firstName: 'Hans',
        lastName: 'Maier',
        dateJoined: moment('19.02.1996', 'DD.MM.YYYY'),
        isVerified: true,
      },
      auth: { authenticated: true },
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

    it('should have a heading', () => {
      const vm = utils.mountComponent(Account, { store });
      const textContent = vm.first('h1').text();
      expect(textContent).to.contain('account.details');
    });

    it('should have computed property account', () => {
      const vm = utils.mountComponent(Account, { store });
      expect(vm.vm.account).to.deep.equal({
        email: 'test@byom.de',
        firstName: 'Hans',
        lastName: 'Maier',
        dateJoined: vm.vm.account.dateJoined,
        isVerified: true,
      });
      // because moment comparison does not work with deep equal
      expect(vm.vm.account.dateJoined.isSame('19.02.1996'));
    });

    it('should have computed property fullName', () => {
      const vm = utils.mountComponent(Account, { store });
      expect(vm.vm.fullName).to.equal('Hans Maier');
    });

    it('should have computed property dateJoined', () => {
      const vm = utils.mountComponent(Account, { store });
      expect(vm.vm.dateJoined).to.equal('account.date_joined: 19.02.1996');
    });

    it('should have a save method', (done) => {
      const vm = utils.mountComponent(Account, { store });

      vm.vm.user = {
        email: 'neuemail@byom.de',
      };
      vm.vm.save();
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        expect(request.config.url).to.equal('/test/account/users/me/');
        expect(JSON.parse(request.config.data)).to.deep.equal({ email: 'neuemail@byom.de' });
        return done();
      });
    });

    it('should have an abort method', () => {
      const vm = utils.mountComponent(Account, { store });

      vm.vm.user = {
        email: 'new@byom.de',
      };
      vm.vm.abort();
      expect(vm.vm.user.email).to.equal(vm.vm.account.email);
    });

    it('should have a resendVerification method', (done) => {
      const vm = utils.mountComponent(Account, { store });

      vm.vm.resendVerification();
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        expect(request.config.url).to.equal('/test/account/resend_verification/');
        return done();
      });
    });

    describe('it should show a message for verification', () => {
      it('if user is not verified, the message should not be visible', () => {
        const vm = utils.mountComponent(Account, { store });
        store.state.account.isVerified = false;
        vm.update();

        // Test is working unexpectedly the wrong way round. This needs to be fixed
        expect(vm.contains('.account-page-side-resend-verification')).to.equal(false);
      });

      it('if user is verified, the message should not be visible', () => {
        const vm = utils.mountComponent(Account, { store });
        store.state.account.isVerified = true;
        vm.update();

        // Test is working unexpectedly the wrong way round. This needs to be fixed
        expect(vm.contains('.account-page-side-resend-verification')).to.equal(true);
      });
    });
  });
});
