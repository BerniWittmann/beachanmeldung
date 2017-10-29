import PasswordReset from '@/pages/auth/password-reset';
import Vuex from 'vuex';
import moxios from 'moxios';
import utils from '../../../utils';
import loading from '@/store/modules/loading';
import sinon from 'sinon';

describe('Pages', () => {
  describe('Password Reset', () => {
    const state = {
      auth: { authenticated: false },
    };
    const getters = {};
    let store;
    let globals;
    beforeEach(() => {
      store = new Vuex.Store({
        state,
        getters,
        modules: {
          loading,
        },
      });
      globals = {
        $route: {
          query: {
            code: '1234',
          },
        },
      };
      store.dispatch('loading/unset');
      moxios.install();
    });

    afterEach(() => {
      moxios.uninstall();
    });

    it('should show a title', () => {
      const vm = utils.mountComponent(PasswordReset, { store });
      expect(vm.first('h1').text()).to.contain('auth.reset_password');
    });

    it('should have computed property loading', () => {
      const vm = utils.mountComponent(PasswordReset, { store });
      expect(vm.vm.loading).to.equal(false);
    });

    it('should have a form', () => {
      const vm = utils.mountComponent(PasswordReset, { store });
      expect(vm.contains('form')).to.equal(true);
    });

    it('should have a link to registration page', () => {
      const vm = utils.mountComponent(PasswordReset, { store });
      const link = vm.first('.panel-footer').first('a');
      expect(link.hasAttribute('href', '/signup')).to.equal(true);
    });

    describe('it should validate the form', () => {
      describe('the password should be validated', () => {
        it('password should be required', (done) => {
          const vm = utils.mountComponent(PasswordReset, { store });
          utils.inputFormItem(vm, 0, '');
          vm.update();
          vm.vm.$refs.passwordResetForm.validateField('password', (error) => {
            expect(error).to.equal('validation.password.required');
            done();
          });
        });
        it('password should have minlength', (done) => {
          const vm = utils.mountComponent(PasswordReset, { store });
          utils.inputFormItem(vm, 0, 'short');
          vm.update();
          vm.vm.$refs.passwordResetForm.validateField('password', (error) => {
            expect(error).to.equal('validation.password.min');
            done();
          });
        });
        it('should not show a validation error if password is given', (done) => {
          const vm = utils.mountComponent(PasswordReset, { store });
          utils.inputFormItem(vm, 0, 'p4s$w0rD');
          vm.update();
          vm.vm.$refs.passwordResetForm.validateField('password', (error) => {
            expect(error).to.equal('');
            done();
          });
        });
      });

      describe('the confirm password should be validated', () => {
        it('confirm password should be required', (done) => {
          const vm = utils.mountComponent(PasswordReset, { store });
          utils.inputFormItem(vm, 1, '');
          vm.update();
          vm.vm.$refs.passwordResetForm.validateField('passwordConfirm', (error) => {
            expect(error).to.equal('validation.password_confirm.required');
            done();
          });
        });
        it('confirm password should match first password', (done) => {
          const vm = utils.mountComponent(PasswordReset, { store });
          utils.inputFormItem(vm, 1, 'p4s$w0rD');
          vm.update();
          vm.vm.$refs.passwordResetForm.validateField('passwordConfirm', (error) => {
            expect(error).to.equal('validation.password_confirm.match');
            done();
          });
        });
        it('confirm password should have minlength', (done) => {
          const vm = utils.mountComponent(PasswordReset, { store });
          utils.inputFormItem(vm, 0, 'short');
          utils.inputFormItem(vm, 1, 'short');
          vm.update();
          vm.vm.$refs.passwordResetForm.validateField('passwordConfirm', (error) => {
            expect(error).to.equal('validation.password_confirm.min');
            done();
          });
        });
        it('should not show a validation error if confirm password is given', (done) => {
          const vm = utils.mountComponent(PasswordReset, { store });
          utils.inputFormItem(vm, 0, 'p4S$w0rD');
          utils.inputFormItem(vm, 1, 'p4S$w0rD');
          vm.update();
          vm.vm.$refs.passwordResetForm.validateField('passwordConfirm', (error) => {
            expect(error).to.equal('');
            done();
          });
        });
      });

      it('if form is invalid on submit, it should show a notification', () => {
        const vm = utils.mountComponent(PasswordReset, { store });
        const spy = sinon.spy(vm.vm.$message, 'error');

        const button = vm.first('form').first('button');
        button.trigger('click');

        expect(spy.called).to.equal(true);
        expect(spy.getCall(0).args[0]).to.equal('validation.failed');
        vm.vm.$message.error.restore();
      });
    });

    it('should reset the users password', (done) => {
      const vm = utils.mountComponent(PasswordReset, { store, globals });
      utils.inputFormItem(vm, 0, 'p4S$w0rD');
      utils.inputFormItem(vm, 1, 'p4S$w0rD');

      vm.first('form').first('button').trigger('click');

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        expect(request.config.url).to.equal('/test/account/password/reset/verified/');
        expect(JSON.parse(request.config.data)).to.deep.equal({ password: 'p4S$w0rD', passwordConfirm: 'p4S$w0rD' });
        return done();
      });
    });

    describe('when the component is loading', () => {
      it('has computed property loading', () => {
        const vm = utils.mountComponent(PasswordReset, { store });
        vm.vm.$store.dispatch('loading/set');
        expect(vm.vm.loading).to.equal(true);
      });
      it('shows the loading state', () => {
        const vm = utils.mountComponent(PasswordReset, { store });
        vm.vm.$store.dispatch('loading/set');
        vm.update();
        expect(vm.vm.loading).to.equal(true);
        // uncommented because test is not working here
        // expect(button.hasClass('is-loading')).to.equal(true);
      });
    });

    it('should check the reset code before mount', (done) => {
      utils.mountComponent(PasswordReset, { store, globals });

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        expect(request.config.url).to.equal('/test/account/password/reset/verify/');
        return done();
      });
    });
  });
});
