import Panel from '@/components/panel';
import utils from '../../utils';

describe('Components', () => {
  describe('Panel', () => {
    describe('should fill the slots', () => {
      it('should fill the header slot', () => {
        const vm = utils.mountComponent(Panel, { slots: { header: utils.getTestComponent() } });
        const textContent = vm.first('.panel-heading').text();
        expect(textContent).to.contain('test_component');
      });
      it('should hide the header if none is given', () => {
        const vm = utils.mountComponent(Panel);
        expect(vm.contains('.panel-heading')).to.equal(false);
      });
      it('should fill the body slot', () => {
        const vm = utils.mountComponent(Panel, { slots: { body: utils.getTestComponent() } });
        const textContent = vm.first('.panel-body').text();
        expect(textContent).to.contain('test_component');
      });
      it('should hide the body if none is given', () => {
        const vm = utils.mountComponent(Panel);
        expect(vm.contains('.panel-body')).to.equal(false);
      });
      it('should fill the footer slot', () => {
        const vm = utils.mountComponent(Panel, { slots: { footer: utils.getTestComponent() } });
        const textContent = vm.first('.panel-footer').text();
        expect(textContent).to.contain('test_component');
      });
      it('should hide the footer if none is given', () => {
        const vm = utils.mountComponent(Panel);
        expect(vm.contains('.panel-footer')).to.equal(false);
      });
      it('should fill all slots at once', () => {
        const vm = utils.mountComponent(Panel, {
          slots: {
            header: utils.getTestComponent(),
            body: utils.getTestComponent(),
            footer: utils.getTestComponent(),
          },
        });
        expect(vm.contains('.panel-heading')).to.equal(true);
        expect(vm.contains('.panel-body')).to.equal(true);
        expect(vm.contains('.panel-footer')).to.equal(true);
      });
    });

    describe('has contextual styles', () => {
      it('should have a default style', () => {
        const vm = utils.mountComponent(Panel);
        expect(vm.hasClass('panel-default')).to.equal(true);
      });

      it('should be able to receive contextual styles', () => {
        const vm = utils.mountComponent(Panel, { propsData: { contextualStyle: 'warning' } });
        expect(vm.hasClass('panel-warning')).to.equal(true);
        expect(vm.hasClass('panel-default')).to.equal(false);
      });
    });
  });
});
