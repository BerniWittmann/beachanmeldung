import utils from '../../utils';
// Using basic Panel component which uses mixin, for easier testing
import Panel from '@/components/panel';

describe('Mixins', () => {
  describe('Slot', () => {
    describe('hasSlot method', () => {
      it('should check if slot exists', () => {
        const vm = utils.mountComponent(Panel, { slots: { header: utils.getTestComponent() } });
        expect(vm.vm.hasSlot('header')).equal(true);
      });

      it('should check is slot not exists', () => {
        const vm = utils.mountComponent(Panel);
        expect(vm.vm.hasSlot('footer')).equal(false);
      });

      it('should default slotname to default', () => {
        const vm = utils.mountComponent(Panel, { slots: { default: utils.getTestComponent() } });
        expect(vm.vm.hasSlot()).equal(true);
      });
    });
  });
});
