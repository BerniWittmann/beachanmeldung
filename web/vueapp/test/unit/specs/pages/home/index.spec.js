import Home from '@/pages/home';
import Vuex from 'vuex';
import utils from '../../../utils';

describe('Pages', () => {
  describe('Home', () => {
    const state = {
      auth: { authenticated: false },
      account: { isStaff: false },
      tournament: { tournaments: [] },
      team: { teams: [] },
      config: {
        year: 2018
      }
    };
    const getters = {
      team: () => ({
        teamsByUser: () => [],
      }),
    };
    let store;
    beforeEach(() => {
      store = new Vuex.Store({
        state,
        getters,
      });
    });

    it('should resolve the footer', () => {
      const vm = utils.mountComponent(Home, { store });
      expect(vm.contains('.footer')).to.equal(true);
    });

    it('should have a computed property for the current year', () => {
      const vm = utils.mountComponent(Home, { store });
      expect(vm.vm.year).to.equal(2018);
    });

    it('should have computed property for all tournaments', () => {
      const vm = utils.mountComponent(Home, { store });
      expect(vm.vm.tournaments).to.deep.equal([]);
    });
  });
});
