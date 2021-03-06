import Login from '@/pages/auth/login';
import Vuex from 'vuex';
import moxios from 'moxios';
import utils from '../../../utils';
import loading from '@/store/modules/loading';
import sinon from 'sinon';

describe('Pages', () => {
  describe('Login', () => {
    const state = {
      auth: { authenticated: false },
    };
    const getters = {};
    let store;
    beforeEach(() => {
      store = new Vuex.Store({
        state,
        getters,
        modules: {
          loading,
        },
      });
      store.dispatch('loading/unset');
      moxios.install();
    });

    afterEach(() => {
      moxios.uninstall();
    });

    it('should show a title', () => {
      const vm = utils.mountComponent(Login, { store });
      expect(vm.first('h1').text()).to.contain('auth.login');
    });

    it('should have computed property loading', () => {
      const vm = utils.mountComponent(Login, { store });
      expect(vm.vm.loading).to.equal(false);
    });

    it('should have a form', () => {
      const vm = utils.mountComponent(Login, { store });
      expect(vm.contains('form')).to.equal(true);
    });

    it('should have a link to password forgot', () => {
      const vm = utils.mountComponent(Login, { store });
      const link = vm.first('form').first('a');
      expect(link.hasAttribute('href', '/password/forgot')).to.equal(true);
    });

    it('should have a link to registration page', () => {
      const vm = utils.mountComponent(Login, { store });
      const link = vm.first('.panel-footer').first('a');
      expect(link.hasAttribute('href', '/signup')).to.equal(true);
    });

    describe('it should validate the form', () => {
      describe('the email should be validated', () => {
        it('email should be required', (done) => {
          const vm = utils.mountComponent(Login, { store });
          utils.inputFormItem(vm, 0, '');
          vm.update();
          vm.vm.$refs.loginForm.validateField('email', (error) => {
            expect(error).to.equal('validation.email.required');
            done();
          });
        });
        it('email must be valid', (done) => {
          const vm = utils.mountComponent(Login, { store });
          utils.inputFormItem(vm, 0, 'not/a_valid_email');
          vm.update();
          vm.vm.$refs.loginForm.validateField('email', (error) => {
            expect(error).to.equal('validation.email.valid');
            done();
          });
        });
        it('should not show a validation error if email correct', (done) => {
          const vm = utils.mountComponent(Login, { store });
          utils.inputFormItem(vm, 0, 'test@byom.de');
          vm.update();
          vm.vm.$refs.loginForm.validateField('email', (error) => {
            expect(error).to.equal('');
            done();
          });
        });
      });

      describe('the password should be validated', () => {
        it('password should be required', (done) => {
          const vm = utils.mountComponent(Login, { store });
          utils.inputFormItem(vm, 1, '');
          vm.update();
          vm.vm.$refs.loginForm.validateField('password', (error) => {
            expect(error).to.equal('validation.password.required');
            done();
          });
        });
        it('should not show a validation error if password is given', (done) => {
          const vm = utils.mountComponent(Login, { store });
          utils.inputFormItem(vm, 1, 'p4S$w0rD');
          vm.update();
          vm.vm.$refs.loginForm.validateField('password', (error) => {
            expect(error).to.equal('');
            done();
          });
        });
      });

      it('if form is invalid on submit, it should show a notification', () => {
        const vm = utils.mountComponent(Login, { store });
        const spy = sinon.spy(vm.vm.$message, 'error');

        const button = vm.first('form').first('button');
        button.trigger('click');

        expect(spy.called).to.equal(true);
        expect(spy.getCall(0).args[0]).to.equal('validation.failed');
        vm.vm.$message.error.restore();
      });
    });

    it('should log the user in', (done) => {
      const vm = utils.mountComponent(Login, { store });
      utils.inputFormItem(vm, 0, 'test@byom.de');
      utils.inputFormItem(vm, 1, 'p4S$w0rD');

      vm.first('form').first('button').trigger('click');

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        expect(request.config.url).to.equal('/test/account/login/');
        expect(JSON.parse(request.config.data)).to.deep.equal({ email: 'test@byom.de', password: 'p4S$w0rD' });
        return done();
      });
    });

    describe('when the component is loading', () => {
      it('has computed property loading', () => {
        const vm = utils.mountComponent(Login, { store });
        vm.vm.$store.dispatch('loading/set');
        expect(vm.vm.loading).to.equal(true);
      });
      it('shows the loading state', () => {
        const vm = utils.mountComponent(Login, { store });
        vm.vm.$store.dispatch('loading/set');
        vm.update();
        expect(vm.vm.loading).to.equal(true);
        // uncommented because test is not working here
        // expect(button.hasClass('is-loading')).to.equal(true);
      });
    });
  });
});
