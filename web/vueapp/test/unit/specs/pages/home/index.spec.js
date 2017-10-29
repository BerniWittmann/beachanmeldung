import Home from '@/pages/home';
import Vuex from 'vuex';
import utils from '../../../utils';

describe('Pages', () => {
  describe('Home', () => {
    const state = {
      auth: { authenticated: false },
    };
    let store;
    beforeEach(() => {
      store = new Vuex.Store({
        state,
      });
    });

    it('should contain buttons', () => {
      const vm = utils.mountComponent(Home, { store });
      expect(vm.find('button').length).to.be.above(0);
    });

    it('should resolve the footer', () => {
      const vm = utils.mountComponent(Home, { store });
      expect(vm.contains('.footer')).to.equal(true);
    });
  });
});
