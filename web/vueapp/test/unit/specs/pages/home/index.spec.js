import Home from '@/pages/home';
import Vuex from 'vuex';
import utils from '../../../utils';
import moment from 'moment';

describe('Pages', () => {
  describe('Home', () => {
    const state = {
      auth: { authenticated: false },
      tournament: { tournaments: [] },
      team: { teams: [] },
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
      expect(vm.vm.currentYear).to.equal(moment().format('YYYY'));
    });

    it('should have computed property for all tournaments', () => {
      const vm = utils.mountComponent(Home, { store });
      expect(vm.vm.tournaments).to.deep.equal([]);
    });
  });
});
