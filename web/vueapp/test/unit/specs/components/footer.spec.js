import Footer from '@/components/footer';
import utils from '../../utils';
import moment from 'moment';
import Vuex from 'vuex';

describe('Components', () => {
  describe('Footer', () => {
    const state = { account: { isStaff: false } };
    let store;
    beforeEach(() => {
      store = new Vuex.Store({
        state,
      });
    });

    it('should have a computed property for the current year', () => {
      expect(Footer.computed.currentYear()).to.equal(moment().format('YYYY'));
    });

    describe('should render a copyright notice', () => {
      it('should include the correct year', () => {
        const vm = utils.mountComponent(Footer, { store });
        const textContent = vm.first('.footer-paragrap-copyright').text();
        expect(textContent).to.contain(moment().format('YYYY'));
      });

      it('should include the name', () => {
        const vm = utils.mountComponent(Footer, { store });

        const textContent = vm.first('.footer-paragrap-copyright').text();
        expect(textContent).to.contain('general.copyright_name');
      });
    });

    describe('should contain links to several pages', () => {
      let vm;
      beforeEach(() => {
        vm = utils.mountComponent(Footer, { store });
      });
      it('should link to the contact page', () => {
        const element = vm.find('.footer-paragraph')[2];
        expect(element.text()).to.contain('nav.contact');
      });

      it('should link to the about page', () => {
        const element = vm.find('.footer-paragraph')[3];
        console.log(element.html());
        expect(element.text()).to.contain('nav.imprint');
      });

      it('should link to the privacy page', () => {
        const element = vm.find('.footer-paragraph')[4];
        expect(element.text()).to.contain('nav.privacy');
      });
    });
  });
});
