import BackgroundWithSide from '@/layouts/backgroundWithSide';
import Vuex from 'vuex';
import utils from '../../utils';

describe('Layouts', () => {
  describe('Background With Side', () => {
    const state = { auth: { authenticated: false } };
    let store;
    beforeEach(() => {
      store = new Vuex.Store({
        state,
      });
    });

    it('should include the navigation', () => {
      const vm = utils.mountComponent(BackgroundWithSide, { store });
      expect(vm.contains('.nav')).to.equal(true);
    });

    it('should include the footer', () => {
      const vm = utils.mountComponent(BackgroundWithSide, { store });
      expect(vm.contains('.footer')).to.equal(true);
    });

    it('should resolve the default slot', () => {
      const vm = utils.mountComponent(BackgroundWithSide, {
        store,
        slots: {
          default: utils.getTestComponent(),
        },
      });
      expect(vm.contains('.test-component')).to.equal(true);
    });

    it('should resolve the side slot', () => {
      const vm = utils.mountComponent(BackgroundWithSide, {
        store,
        slots: {
          side: utils.getTestComponent(),
        },
      });
      expect(vm.contains('.test-component')).to.equal(true);
    });
  });
});
