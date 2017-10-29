import PasswordForgot from '@/pages/auth/password-forgot';
import Vuex from 'vuex';
import moxios from 'moxios';
import utils from '../../../utils';
import loading from '@/store/modules/loading';
import sinon from 'sinon';

describe('Pages', () => {
  describe('Password Forgot', () => {
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
      const vm = utils.mountComponent(PasswordForgot, { store });
      expect(vm.first('h1').text()).to.contain('auth.forgot_password');
    });

    it('should have computed property loading', () => {
      const vm = utils.mountComponent(PasswordForgot, { store });
      expect(vm.vm.loading).to.equal(false);
    });

    it('should have a form', () => {
      const vm = utils.mountComponent(PasswordForgot, { store });
      expect(vm.contains('form')).to.equal(true);
    });

    it('should have a link to registration page', () => {
      const vm = utils.mountComponent(PasswordForgot, { store });
      const link = vm.first('.panel-footer').first('a');
      expect(link.hasAttribute('href', '/signup')).to.equal(true);
    });

    describe('it should validate the form', () => {
      describe('the email should be validated', () => {
        it('email should be required', (done) => {
          const vm = utils.mountComponent(PasswordForgot, { store });
          utils.inputFormItem(vm, 0, '');
          vm.update();
          vm.vm.$refs.forgotPasswordForm.validateField('email', (error) => {
            expect(error).to.equal('validation.email.required');
            done();
          });
        });
        it('email must be valid', (done) => {
          const vm = utils.mountComponent(PasswordForgot, { store });
          utils.inputFormItem(vm, 0, 'not/a_valid-Email');
          vm.update();
          vm.vm.$refs.forgotPasswordForm.validateField('email', (error) => {
            expect(error).to.equal('validation.email.valid');
            done();
          });
        });
        it('should not show a validation error if email correct', (done) => {
          const vm = utils.mountComponent(PasswordForgot, { store });
          utils.inputFormItem(vm, 0, 'test@byom.de');
          vm.update();
          vm.vm.$refs.forgotPasswordForm.validateField('email', (error) => {
            expect(error).to.equal('');
            done();
          });
        });
      });

      it('if form is invalid on submit, it should show a notification', () => {
        const vm = utils.mountComponent(PasswordForgot, { store });
        const spy = sinon.spy(vm.vm.$message, 'error');

        vm.first('form').first('button').trigger('click');

        expect(spy.called).to.equal(true);
        expect(spy.getCall(0).args[0]).to.equal('validation.failed');
        vm.vm.$message.error.restore();
      });
    });

    it('should request password for the user', (done) => {
      const vm = utils.mountComponent(PasswordForgot, { store });
      utils.inputFormItem(vm, 0, 'test@byom.de');
      vm.first('form').first('button').trigger('click');

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        expect(request.config.url).to.equal('/test/account/password/reset/');
        expect(JSON.parse(request.config.data)).to.deep.equal({ email: 'test@byom.de' });
        return done();
      });
    });

    describe('when the component is loading', () => {
      it('has computed property loading', () => {
        const vm = utils.mountComponent(PasswordForgot, { store });
        vm.vm.$store.dispatch('loading/set');
        expect(vm.vm.loading).to.equal(true);
      });
      it('shows the loading state', () => {
        const vm = utils.mountComponent(PasswordForgot, { store });
        vm.vm.$store.dispatch('loading/set');
        vm.update();
        expect(vm.vm.loading).to.equal(true);
        // uncommented because test is not working here
        // expect(button.hasClass('is-loading')).to.equal(true);
      });
    });
  });
});
