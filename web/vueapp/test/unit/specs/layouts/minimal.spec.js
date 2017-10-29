import Minimal from '@/layouts/minimal';
import Vuex from 'vuex';
import utils from '../../utils';

describe('Layouts', () => {
  describe('Minimal', () => {
    const state = { auth: { authenticated: false } };
    let store;
    beforeEach(() => {
      store = new Vuex.Store({
        state,
      });
    });

    it('should not include the navigation', () => {
      const vm = utils.mountComponent(Minimal, { store });
      expect(vm.contains('.nav')).to.equal(false);
    });

    it('should resolve the Minimal slot', () => {
      const vm = utils.mountComponent(Minimal, {
        store,
        slots: {
          default: utils.getTestComponent(),
        },
      });
      expect(vm.contains('.test-component')).to.equal(true);
    });
  });
});
