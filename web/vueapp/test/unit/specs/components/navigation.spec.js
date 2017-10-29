import Navigation from '@/components/navigation';
import utils from '../../utils';
import Vuex from 'vuex';
import sinon from 'sinon';

describe('Components', () => {
  describe('Navigation', () => {
    const state = { auth: { authenticated: false } };
    const actions = { auth: { logout: sinon.stub() } };
    let store;
    beforeEach(() => {
      store = new Vuex.Store({
        state,
        actions,
      });
    });

    it('should have a logo', () => {
      const vm = utils.mountComponent(Navigation, { store });
      const image = vm.first('img');
      expect(image.hasAttribute('src', '/static/images/logo.png')).to.equal(true);
    });
    it('the logo should have a link to home', () => {
      const vm = utils.mountComponent(Navigation, { store });
      const link = vm.first('a');
      expect(link.hasAttribute('href', '/home')).to.equal(true);
    });

    it('should have computed property for current Route', () => {
      const vm = utils.mountComponent(Navigation, { store });
      const currentRoute = vm.vm.activeRoute;
      expect(currentRoute).to.equal('etc.comingSoon');
    });

    describe('the user is logged out', () => {
      beforeEach(() => {
        state.auth.authenticated = false;
      });
      it('should have computed property for loggedin', () => {
        const vm = utils.mountComponent(Navigation, { store });
        const loggedIn = vm.vm.isLoggedIn;
        expect(loggedIn).to.equal(false);
      });
      it('should show Login Button', () => {
        const vm = utils.mountComponent(Navigation, { store });
        const link = vm.first('.nav-right').first('li');
        expect(link.text()).to.equal('nav.login');
      });
    });

    describe('the user is logged in', () => {
      beforeEach(() => {
        state.auth.authenticated = true;
      });
      it('should have computed property for loggedin', () => {
        const vm = utils.mountComponent(Navigation, { store });
        const loggedIn = vm.vm.isLoggedIn;
        expect(loggedIn).to.equal(true);
      });
      it('should show Link to Account Page', () => {
        const vm = utils.mountComponent(Navigation, { store });
        const link = vm.first('.nav-right').first('li');
        expect(link.text()).to.equal('nav.account');
      });
      it('should show Logout Button', () => {
        const vm = utils.mountComponent(Navigation, { store });
        const link = vm.first('.nav-right').find('li')[1];
        expect(link.text()).to.equal('nav.logout');
      });
      it('on click on logout it should log the user out', () => {
        // This test is incomplete and needs to be redone...
        const vm = utils.mountComponent(Navigation, { store });
        const spy = sinon.spy(vm.vm, 'logout');

        vm.vm.logout();

        expect(spy.called).to.equal(true);
      });
    });
  });
});
