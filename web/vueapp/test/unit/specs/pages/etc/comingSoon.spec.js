import ComingSoon from '@/pages/etc/comingSoon';
import Vuex from 'vuex';
import utils from '../../../utils';

describe('Pages', () => {
  describe('ComingSoon', () => {
    const state = {
      auth: { authenticated: false },
    };
    let store;
    beforeEach(() => {
      store = new Vuex.Store({
        state,
      });
    });

    it('should include a heading', () => {
      const vm = utils.mountComponent(ComingSoon, { store });
      const textContent = vm.first('h1').text();
      expect(textContent).to.equal('comingSoon.title');
    });

    it('should have a button for registration', () => {
      const vm = utils.mountComponent(ComingSoon, { store });
      const button = vm.first('.panel').first('a');
      expect(button.hasAttribute('href', '/signup')).to.equal(true);
    });
  });
});
