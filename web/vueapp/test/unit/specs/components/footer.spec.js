import Footer from '@/components/footer';
import utils from '../../utils';
import moment from 'moment';

describe('Components', () => {
  describe('Footer', () => {
    it('should have a computed property for the current year', () => {
      expect(Footer.computed.currentYear()).to.equal(moment().format('YYYY'));
    });

    describe('should render a copyright notice', () => {
      it('should include the correct year', () => {
        const vm = utils.mountComponent(Footer);
        const textContent = vm.first('.footer-paragrap-copyright').text();
        expect(textContent).to.contain(moment().format('YYYY'));
      });

      it('should include the name', () => {
        const vm = utils.mountComponent(Footer);

        const textContent = vm.first('.footer-paragrap-copyright').text();
        expect(textContent).to.contain('general.copyright_name');
      });
    });

    describe('should contain links to several pages', () => {
      let vm;
      beforeEach(() => {
        vm = utils.mountComponent(Footer);
      });

      it('should link to the team page', () => {
        const element = vm.find('.footer-paragraph')[2];
        expect(element.text()).to.contain('nav.team');
        expect(element.first('a').hasAttribute('href', '/team')).to.equal(true);
      });

      it('should link to the contact page', () => {
        const element = vm.find('.footer-paragraph')[3];
        expect(element.text()).to.contain('nav.contact');
        // Use test again, when implemented link
        // expect(element.querySelector('a').getAttribute('href')).to.equal('/contact');
      });

      it('should link to the about page', () => {
        const element = vm.find('.footer-paragraph')[4];
        expect(element.text()).to.contain('nav.about');
        // Use test again, when implemented link
        // expect(element.querySelector('a').getAttribute('href')).to.equal('/about');
      });

      it('should link to the privacy page', () => {
        const element = vm.find('.footer-paragraph')[5];
        expect(element.text()).to.contain('nav.privacy');
        // Use test again, when implemented link
        // expect(element.querySelector('a').getAttribute('href')).to.equal('/privacy');
      });
    });
  });
});
