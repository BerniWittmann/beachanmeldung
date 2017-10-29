import FullWidth from '@/layouts/fullWidth';
import Vuex from 'vuex';
import utils from '../../utils';

describe('Layouts', () => {
  describe('FullWidth', () => {
    const state = { auth: { authenticated: false } };
    let store;
    beforeEach(() => {
      store = new Vuex.Store({
        state,
      });
    });

    it('should include the navigation', () => {
      const vm = utils.mountComponent(FullWidth, { store });
      expect(vm.contains('.nav')).to.equal(true);
    });

    it('should include the footer', () => {
      const vm = utils.mountComponent(FullWidth, { store });
      expect(vm.contains('.footer')).to.equal(true);
    });

    it('should resolve the FullWidth slot', () => {
      const vm = utils.mountComponent(FullWidth, {
        store,
        slots: {
          default: utils.getTestComponent(),
        },
      });
      expect(vm.contains('.test-component')).to.equal(true);
    });
  });
});
