import LinkButton from '@/components/linkButton';
import utils from '../../utils';
import sinon from 'sinon';

describe('Components', () => {
  describe('LinkButton', () => {
    describe('gets a route object', () => {
      it('should point to the route', () => {
        const vm = utils.mountComponent(LinkButton, { propsData: { route: { name: 'auth.login' } } });
        expect(vm.hasAttribute('href', '/login')).to.equal(true);
      });

      it('should pass the content', () => {
        const vm = utils.mountComponent(LinkButton, {
          slots: {
            default: utils.getTestComponent(),
          },
        });
        const textContent = vm.first('button').text();
        expect(textContent).to.contain('test_component');
      });

      it('if the button is disabled it should not contain an href', () => {
        const vm = utils.mountComponent(LinkButton, {
          propsData: {
            route: {
              name: 'etc.team',
            },
            disabled: true,
          },
        });
        expect(vm.hasAttribute('href', '/team')).to.equal(false);
        expect(vm.html()).not.to.contain('/team');
      });

      describe('should set button options by the props', () => {
        it('should set button type', () => {
          const vm = utils.mountComponent(LinkButton, { propsData: { type: 'success' } });
          expect(vm.first('button').hasClass('el-button--success')).to.equal(true);
        });

        it('should set button size', () => {
          const vm = utils.mountComponent(LinkButton, { propsData: { size: 'lg' } });
          expect(vm.first('button').hasClass('el-button--lg')).to.equal(true);
        });

        it('should set button loading states', () => {
          const vm = utils.mountComponent(LinkButton, { propsData: { loading: true } });
          expect(vm.first('button').hasClass('is-loading')).to.equal(true);
        });

        it('should set button disable state', () => {
          const vm = utils.mountComponent(LinkButton, { propsData: { disabled: true } });
          const button = vm.first('button');
          expect(button.hasClass('is-disabled')).to.equal(true);
          expect(button.hasAttribute('disabled', 'disabled')).to.equal(true);
        });

        it('should set button native-type', () => {
          const vm = utils.mountComponent(LinkButton, { propsData: { nativeType: 'submit' } });
          const button = vm.first('button');
          expect(button.hasAttribute('type', 'submit')).to.equal(true);
        });
      });
    });

    describe('gets a url', () => {
      it('should point to the href', () => {
        const vm = utils.mountComponent(LinkButton, { propsData: { href: 'http://example.com' } });
        expect(vm.hasAttribute('href', 'http://example.com')).to.equal(true);
      });

      it('should set the target', () => {
        const vm = utils.mountComponent(LinkButton, { propsData: { href: 'http://example.com', target: '_blank' } });
        expect(vm.hasAttribute('target', '_blank')).to.equal(true);
      });

      it('should not set the target without href', () => {
        const vm = utils.mountComponent(LinkButton, { propsData: { target: '_blank' } });
        expect(vm.hasAttribute('target', '_blank')).to.equal(false);
      });

      it('should pass the content', () => {
        const vm = utils.mountComponent(LinkButton, {
          slots: {
            default: utils.getTestComponent(),
          },
        });
        const textContent = vm.first('button').text();
        expect(textContent).to.contain('test_component');
      });

      it('if the button is disabled it should not contain an href', () => {
        const vm = utils.mountComponent(LinkButton, { propsData: { href: 'http://example.com', disabled: true } });
        expect(vm.hasAttribute('href', 'http://example.com')).to.equal(false);
        expect(vm.html()).not.to.contain('http://example.com');
      });

      describe('should set button options by the props', () => {
        it('should set button type', () => {
          const vm = utils.mountComponent(LinkButton, { propsData: { type: 'success' } });
          expect(vm.first('button').hasClass('el-button--success')).to.equal(true);
        });

        it('should set button size', () => {
          const vm = utils.mountComponent(LinkButton, { propsData: { size: 'lg' } });
          expect(vm.first('button').hasClass('el-button--lg')).to.equal(true);
        });

        it('should set button loading states', () => {
          const vm = utils.mountComponent(LinkButton, { propsData: { loading: true } });
          expect(vm.first('button').hasClass('is-loading')).to.equal(true);
        });

        it('should set button disable state', () => {
          const vm = utils.mountComponent(LinkButton, { propsData: { disabled: true } });
          const button = vm.first('button');
          expect(button.hasClass('is-disabled')).to.equal(true);
          expect(button.hasAttribute('disabled', 'disabled')).to.equal(true);
        });

        it('should set button native-type', () => {
          const vm = utils.mountComponent(LinkButton, { propsData: { nativeType: 'submit' } });
          const button = vm.first('button');
          expect(button.hasAttribute('type', 'submit')).to.equal(true);
        });
      });
    });

    describe('gets no url or route', () => {
      it('should be a span', () => {
        const vm = utils.mountComponent(LinkButton);
        expect(vm.is('span')).to.equal(true);
        expect(vm.hasAttribute('href', '')).to.equal(false);
      });

      it('should handle a click', () => {
        const vm = utils.mountComponent(LinkButton);
        const button = vm.first('button');
        const spy = sinon.spy(vm.vm, 'handleNoRedirect');

        button.trigger('click');

        expect(spy.called).to.equal(true);
      });

      it('should show notification on click', () => {
        const vm = utils.mountComponent(LinkButton);
        const button = vm.first('button');
        const spy = sinon.spy(vm.vm.$router, 'push');

        button.trigger('click');

        expect(spy.called).to.equal(true);
      });

      describe('should set button options by the props', () => {
        it('should set button type', () => {
          const vm = utils.mountComponent(LinkButton, { propsData: { type: 'success' } });
          expect(vm.first('button').hasClass('el-button--success')).to.equal(true);
        });

        it('should set button size', () => {
          const vm = utils.mountComponent(LinkButton, { propsData: { size: 'lg' } });
          expect(vm.first('button').hasClass('el-button--lg')).to.equal(true);
        });

        it('should set button loading states', () => {
          const vm = utils.mountComponent(LinkButton, { propsData: { loading: true } });
          expect(vm.first('button').hasClass('is-loading')).to.equal(true);
        });

        it('should set button disable state', () => {
          const vm = utils.mountComponent(LinkButton, { propsData: { disabled: true } });
          const button = vm.first('button');
          expect(button.hasClass('is-disabled')).to.equal(true);
          expect(button.hasAttribute('disabled', 'disabled')).to.equal(true);
        });

        it('should set button native-type', () => {
          const vm = utils.mountComponent(LinkButton, { propsData: { nativeType: 'submit' } });
          const button = vm.first('button');
          expect(button.hasAttribute('type', 'submit')).to.equal(true);
        });
      });
    });

    describe('should have computed properties', () => {
      describe('show Route', () => {
        it('should not show Route if disabled', () => {
          const vm = utils.mountComponent(LinkButton, { propsData: { route: { name: 'auth.login' }, disabled: true } });
          expect(vm.vm.showRoute).to.equal(false);
        });
        it('should not show Route if route not given', () => {
          const vm = utils.mountComponent(LinkButton);
          expect(vm.vm.showRoute).to.equal(undefined);
        });
        it('should not show Route if href is given', () => {
          const vm = utils.mountComponent(LinkButton, { propsData: { href: '/login', route: { name: 'auth.login' } } });
          expect(vm.vm.showRoute).to.equal(false);
        });
        it('should show Route', () => {
          const vm = utils.mountComponent(LinkButton, { propsData: { route: { name: 'auth.login' } } });
          expect(vm.vm.showRoute).to.equal(true);
        });
      });

      describe('show Href', () => {
        it('should not show href if disabled', () => {
          const vm = utils.mountComponent(LinkButton, { propsData: { href: '/test', disabled: true } });
          expect(vm.vm.showHref).to.equal(false);
        });
        it('should not show href if href not given', () => {
          const vm = utils.mountComponent(LinkButton);
          expect(vm.vm.showHref).to.equal(undefined);
        });
        it('should not show href if route is given', () => {
          const vm = utils.mountComponent(LinkButton, { propsData: { href: '/test', route: { name: 'etc.team' } } });
          expect(vm.vm.showHref).to.equal(false);
        });
        it('should show Href', () => {
          const vm = utils.mountComponent(LinkButton, { propsData: { href: '/test' } });
          expect(vm.vm.showHref).to.equal(true);
        });
      });

      describe('get route url', () => {
        it('should not return anything if disabled', () => {
          const vm = utils.mountComponent(LinkButton, { propsData: { route: { name: 'auth.login' }, disabled: true } });
          expect(vm.vm.routeUrl).to.equal(undefined);
        });
        it('should not return anything if no route given', () => {
          const vm = utils.mountComponent(LinkButton);
          expect(vm.vm.routeUrl).to.equal(undefined);
        });
        it('should return route', () => {
          const vm = utils.mountComponent(LinkButton, { propsData: { route: { name: 'auth.login' } } });
          expect(vm.vm.routeUrl).to.deep.equal({ name: 'auth.login', params: {}, path: '/login' });
        });
      });

      describe('get href url', () => {
        it('should not return anything if disabled', () => {
          const vm = utils.mountComponent(LinkButton, { propsData: { href: '/test', disabled: true } });
          expect(vm.vm.routeHref).to.equal(undefined);
        });
        it('should not return anything if no route given', () => {
          const vm = utils.mountComponent(LinkButton);
          expect(vm.vm.routeHref).to.equal(undefined);
        });
        it('should return route', () => {
          const vm = utils.mountComponent(LinkButton, { propsData: { href: '/test' } });
          expect(vm.vm.routeHref).to.deep.equal('/test');
        });
      });
    });
  });
});
